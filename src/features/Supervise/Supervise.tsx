import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { resetHasShownLostConnectionToServerToast } from "../../utils/customAxios";
import * as FacialRecognitionService from "../../APIServices/FacialRecognitionService.api";
import * as ProfileBlacklistService from "../../APIServices/ProfileBlacklistService.api";
import { ProfileBlacklistGetResponseType } from "../../types/APIServices/ProfileBlacklistService.type";
import { FacialRecognitionPostResponseType } from "../../types/APIServices/FacialRecognitionService.type";
import { WSContext } from "../../utils/context/Contexts";
import { GlobalStateContext } from "../../utils/context/Contexts";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import errIcon from "../../assets/images/error_icon.png";
import { toast } from "react-toastify";

interface ViolationDetectedFromWSType {
  avata: string;
  full_name: string;
  year_of_birth: number | string;
  hometown: string;
  id_number: string;
  violation: string;
  data: string[];
}

const Supervise = () => {
  // setup before fly variable
  const [openSetUpBeforeFly, setOpenSetUpBeforeFly] = useState(true);
  const [hadCompletedSetUpBeforeFly, setHadCompletedSetUpBeforeFly] =
    useState(false);

  // import video file variable
  const [selectedVideo, setSelectedVideo] = useState<File | undefined | null>(
    null
  );
  console.log("selectedVideo: ", selectedVideo);
  const [selectedCameraCheckBox, setSelectedCameraCheckBox] = useState(false);
  const [selectedVideoCheckBox, setSelectedVideoCheckBox] = useState(false);
  console.log("selectedVideoCheckBox: ", selectedVideoCheckBox);

  // WS variable
  const wsContext = useContext(WSContext);
  const ws = wsContext?.ws;
  const connect = wsContext?.connect;
  const disconnect = wsContext?.disconnect;
  const globalStateContext = useContext(GlobalStateContext);
  const startFly = globalStateContext?.startFly;
  const setStartFly = globalStateContext?.setStartFly;

  // info from WS
  const [blackList, setBlackList] = useState<ProfileBlacklistGetResponseType>(
    {}
  );
  const [violationInfo, setViolationInfo] = useState<
    ViolationDetectedFromWSType[]
  >([]);
  // Lọc các giá trị temp hợp lệ
  const validViolationInfo = violationInfo.filter(
    (t) => t !== null && t.full_name
  );

  // lay cam tu uav
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const location = useLocation();

  useEffect(() => {
    resetHasShownLostConnectionToServerToast();
  }, [location]);

  useEffect(() => {
    const handleOpenSetUpBeforeFly = () => {
      setOpenSetUpBeforeFly(true);
    };

    handleOpenSetUpBeforeFly();
  }, [setStartFly]);

  useEffect(() => {
    if (connect) {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    const handleDevices = (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput"));

    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }
  }, []);

  useEffect(() => {
    try {
      if (!ws || !ws.current) return;
      ws.current.onmessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        if (data.data_state === "supervise_complete") {
          console.log(data.data);
          toast.success("Đã hoàn thành nhiệm vụ !", {
            onClose: () => {
              if (setStartFly) {
                setStartFly(false);
              }
              if (disconnect) {
                disconnect();
              }
              setHadCompletedSetUpBeforeFly(false);
              setSelectedVideo(null);
              setSelectedCameraCheckBox(false);
              setSelectedVideoCheckBox(false);
              setBlackList({});
              setViolationInfo([]);
              setOpenSetUpBeforeFly(true);
              if (connect) {
                connect();
              }
            },
          });
        }
        console.log("data:", data);
        const violationDetectedFromWS = data.profile.detections;

        if (setStartFly) {
          setStartFly(true);
        }
        if (violationDetectedFromWS.length > 0) {
          setViolationInfo(violationDetectedFromWS);
        }
      };
    } catch (error) {
      console.log("Error from WS: ", error);
    }
  }, [ws, disconnect, connect, setStartFly, startFly]);

  const handleCloseSetUpBeforeFly = () => {
    setHadCompletedSetUpBeforeFly(false);
    setOpenSetUpBeforeFly(false);
  };

  const handleSelectCameraCheckBox = () => {
    setSelectedVideoCheckBox(false);
    setSelectedVideo(null);
    setSelectedCameraCheckBox((prev) => !prev);
  };

  const handleSelectVideoCheckBox = () => {
    setSelectedCameraCheckBox(false);
    setSelectedVideoCheckBox((prev) => {
      const newValue = !prev;
      if (!newValue) {
        setSelectedVideo(null);
        // setVideoSrc("");
      }
      return newValue;
    });
  };

  const handleVideoImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    console.log("files: ", files);

    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        setSelectedVideo(file);
        // const link = URL?.createObjectURL(file);
        // setVideoSrc(link);
      }
    });
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedVideo((prev) => (prev?.name === fileName ? null : prev));
  };

  const handleSubmitSetUpBeforeFly = () => {
    if (
      (selectedVideo && selectedVideoCheckBox) ||
      (selectedCameraCheckBox && devices.length > 0)
    ) {
      setHadCompletedSetUpBeforeFly(true);
    }
    const formData = new FormData();
    formData.append("camera", selectedCameraCheckBox ? "true" : "false");
    if (selectedVideo) {
      formData.append("video", selectedVideo);
    }
    getConfirmedDataBeforeSupervise(formData);
  };

  const sendConfirmedDataToWS = (data: FacialRecognitionPostResponseType) => {
    if (!ws || !ws.current) return;
    console.log(
      "data to WS: ",
      JSON.stringify({ path: data.path, action: "" })
    );
    ws.current.send(JSON.stringify({ path: data.path, action: "" }));
    if (setStartFly) {
      setStartFly(true);
    }
    handleCloseSetUpBeforeFly();
  };

  const getConfirmedDataBeforeSupervise = async (formData: FormData) => {
    const getConfirmed = await FacialRecognitionService.postData({
      data: formData,
      options: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });

    const getBlacklist = await ProfileBlacklistService.getAllData();

    if (getConfirmed) {
      console.log("ConfirmedDataBeforeSupervise: ", getConfirmed);
      sendConfirmedDataToWS(getConfirmed);
    } else {
      setHadCompletedSetUpBeforeFly(false);
    }

    if (getBlacklist) {
      console.log("BlacklistData: ", getBlacklist);
      setBlackList(getBlacklist);
    }
  };

  const setUpBeforeFly = () => {
    return (
      <>
        <Dialog open={openSetUpBeforeFly} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{
              display: "flex",
              textAlign: "center",
              textTransform: "uppercase",
              backgroundColor: "#1976d2",
              color: "white",
            }}
          >
            <span>Chọn thông tin giám sát</span>
          </DialogTitle>
          <DialogContent
            sx={{
              height: "200px",
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <div>
              {!selectedVideoCheckBox && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCameraCheckBox}
                      onChange={handleSelectCameraCheckBox}
                    />
                  }
                  label={
                    <span className="font-medium text-[0.875rem]">CAMERA</span>
                  }
                />
              )}

              {!selectedCameraCheckBox && (
                <div className="flex">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedVideoCheckBox}
                        onChange={handleSelectVideoCheckBox}
                      />
                    }
                    label={
                      <Button
                        className="!h-10 !-ml-2.5"
                        component="label"
                        htmlFor="superviseVideoFile"
                        disabled={selectedVideoCheckBox ? false : true}
                      >
                        {selectedVideoCheckBox ? "Choose Video File" : "Video"}
                        <input
                          id="superviseVideoFile"
                          name="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          type="file"
                          onChange={(event) => handleVideoImport(event)}
                        />
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
            {selectedVideo && (
              <div className="flex flex-col items-center">
                <p>Đã tải lên 1 video:</p>
                <div className="w-42 flex justify-evenly items-center border border-gray-400 rounded-xl">
                  <UploadFileIcon />
                  <span>{selectedVideo.name}</span>
                  <Button
                    className="!h-fit !min-w-2.5"
                    color="error"
                    onClick={() => handleRemoveFile(selectedVideo.name)}
                  >
                    x
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "16px 24px",
            }}
          >
            <Button
              disabled={hadCompletedSetUpBeforeFly}
              onClick={() => (window.location.hash = "/Blacklist")}
            >
              Hủy
            </Button>

            <Button
              color="primary"
              disabled={
                (selectedVideo && selectedVideoCheckBox && !startFly) ||
                (selectedCameraCheckBox && devices.length > 0 && !startFly)
                  ? false
                  : true
              }
              onClick={handleSubmitSetUpBeforeFly}
            >
              {hadCompletedSetUpBeforeFly === false
                ? "Bắt đầu giám sát"
                : "Đang xử lý..."}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <>
      {setUpBeforeFly()}

      {startFly && (
        <Grid container spacing={1}>
          <Grid size={9}>
            {((selectedCameraCheckBox && devices.length > 0) ||
              (selectedVideo && selectedVideoCheckBox)) && (
              <img
                src="http://localhost:8000/video-stream"
                alt="Video detect stream"
                className="w-full h-full"
              />
            )}
          </Grid>
          <Grid size={3}>
            {blackList && Object.keys(blackList).length > 0 && (
              <div
                className="w-full h-[calc(100vh-64px)] overflow-y-auto flex flex-col 
              items-center"
              >
                <div
                  className="w-[90%] bg-red-500 text-white p-0.25 uppercase font-bold
                      text-center rounded-md !mt-2"
                >
                  <h1>Thông tin đối tượng</h1>
                </div>
                {Object.keys(blackList).map((name, index) => {
                  const isWanted = validViolationInfo.some(
                    (info) => info.full_name === blackList[name].full_name
                  );
                  return (
                    <div
                      key={index}
                      className={`!mt-5.5 !p-2.5 w-[97%] h-[124px] shadow-lg font-bold uppercase 
                        bg-white text-black rounded-lg flex justify-evenly items-center ${
                          isWanted ? "border-2 blink-border" : ""
                        }`}
                    >
                      <img
                        src={
                          import.meta.env.VITE_API_URL + blackList[name].avata
                        }
                        srcSet={
                          import.meta.env.VITE_API_URL + blackList[name].avata
                        }
                        alt="đối tượng vi phạm"
                        className="w-30 h-30 rounded-lg"
                      />
                      <div className="!ml-2.5">
                        <p>Tên: {blackList[name].full_name}</p>
                        <p>Năm sinh: {blackList[name].year_of_birth}</p>
                        <p>Quê quán: {blackList[name].hometown}</p>
                        <p className="text-red-500">
                          Đối tượng giám sát: {index + 1}
                        </p>
                      </div>
                      <div className="w-10 h-10">
                        {isWanted && (
                          <img
                            src={errIcon}
                            srcSet={errIcon}
                            alt="đối tượng vi phạm"
                            className="w-full h-full"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Supervise;
