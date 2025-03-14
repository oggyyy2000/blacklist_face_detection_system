import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { SubmitHandler, useForm } from "react-hook-form";
import * as CreateDataService from "../../../APIServices/CreateDataService.api";
import * as UpdateModelService from "../../../APIServices/UpdateModel.api";
import { TransformProfileBlacklistGetResponseType } from "../../../types/global/Global.type";

import { Button, Dialog, DialogTitle, DialogContent, Fab } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

interface AddBlacklistIndividualFormData {
  newBlacklistIndividualUnsignedFirstName: string;
  newBlacklistIndividualFullName: string;
  newBlacklistIndividualYearOfBirth: string;
  newBlacklistIndividualHometown: string;
  newBlacklistIndividualIdNumber: string;
}

interface AddNewSubjectsProps {
  openAddBlacklistData: boolean;
  setOpenAddBlacklistData: React.Dispatch<React.SetStateAction<boolean>>;
  setBlackList: React.Dispatch<
    React.SetStateAction<TransformProfileBlacklistGetResponseType[]>
  >;

  setIsLoadingUpdateModel: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadingAddData: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddNewSubjects = ({
  openAddBlacklistData,
  setOpenAddBlacklistData,
  setBlackList,
  setIsLoadingUpdateModel,
  setIsLoadingAddData,
}: AddNewSubjectsProps) => {
  const [avatarNewBlacklistIndividual, setAvatarNewBlacklistIndividual] =
    useState<File | undefined | null>();
  const [
    imagesDatasetNewBlacklistIndividual,
    setImagesDatasetNewBlacklistIndividual,
  ] = useState<File[] | undefined | null>();

  // form variable
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
    reset,
    clearErrors,
  } = useForm<AddBlacklistIndividualFormData>({
    mode: "onTouched",
    reValidateMode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: false,
  });

  useEffect(() => {
    if (openAddBlacklistData) {
      reset({
        newBlacklistIndividualUnsignedFirstName: "",
        newBlacklistIndividualFullName: "",
        newBlacklistIndividualYearOfBirth: "",
        newBlacklistIndividualHometown: "",
        newBlacklistIndividualIdNumber: "",
      });
    }
  }, [openAddBlacklistData, reset]);

  const handleActionAddBlacklistData = () => {
    setOpenAddBlacklistData(true);
  };

  const onChangeHandleImportAvatarNewBlacklistIndividual = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setAvatarNewBlacklistIndividual(files[0]);
  };

  const onChangeHandleImportImageDatasetNewBlacklistIndividual = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setImagesDatasetNewBlacklistIndividual(
      files.filter((file) => file.type.startsWith("image/"))
    );
  };

  const handleUpdateModel = async () => {
    setIsLoadingUpdateModel(true);
    const responsePostUpdateModel = await UpdateModelService.postData();
    if (responsePostUpdateModel) {
      toast.success(
        (responsePostUpdateModel as unknown as { message: string }).message,
        {
          onClose: () => {
            setIsLoadingUpdateModel(false);
            setBlackList([]);
          },
        }
      );
    }
  };

  const handleSubmitActionAddBlacklistData: SubmitHandler<
    AddBlacklistIndividualFormData
  > = async (data) => {
    setIsLoadingAddData(true);

    const formData = new FormData();
    formData.append("avata", avatarNewBlacklistIndividual as Blob);
    formData.append("name", data.newBlacklistIndividualUnsignedFirstName);
    formData.append("full_name", data.newBlacklistIndividualFullName);
    formData.append("year_of_birth", data.newBlacklistIndividualYearOfBirth);
    formData.append("hometown", data.newBlacklistIndividualHometown);
    formData.append("id_number", data.newBlacklistIndividualIdNumber);
    formData.append("violation", "");
    if (imagesDatasetNewBlacklistIndividual) {
      for (let i = 0; i < imagesDatasetNewBlacklistIndividual.length; i++) {
        console.log(imagesDatasetNewBlacklistIndividual[i]);
        formData.append("data", imagesDatasetNewBlacklistIndividual[i]);
      }
    }

    const response = await CreateDataService.postData({
      data: formData,
      options: { headers: { "Content-Type": "multipart/form-data" } },
    });
    if (response) {
      return toast.success(
        (response as unknown as { message: string }).message,
        {
          onClose: () => {
            setIsLoadingAddData(false);
            setAvatarNewBlacklistIndividual(null);
            setImagesDatasetNewBlacklistIndividual(null);
            setOpenAddBlacklistData(false);
            handleUpdateModel();
            reset({}, { keepIsSubmitted: false });
          },
        }
      );
    }
  };

  return (
    <>
      <Fab
        color="success"
        style={{
          position: "absolute",
          right: 8,
          top: 105,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
        title="Thêm đối tượng"
        onClick={handleActionAddBlacklistData}
        disabled={isSubmitSuccessful ? true : false}
      >
        <NoteAddIcon />
      </Fab>

      {openAddBlacklistData && (
        <Dialog open={openAddBlacklistData} fullWidth maxWidth="xs">
          <DialogTitle
            sx={{
              textAlign: "center",
              bgcolor: "#1976d2",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            Thêm đối tượng mới
          </DialogTitle>
          <DialogContent>
            <form
              className="flex flex-col justify-evenly items-center h-[550px]"
              onSubmit={handleSubmit(handleSubmitActionAddBlacklistData)}
            >
              {/* Trường ảnh đại diện nhận diện đối tượng */}
              <div className="w-full flex justify-evenly items-center">
                <label
                  htmlFor="new-blacklist-individual-avatar"
                  className={`w-full text-gray-700 font-medium ${
                    isSubmitSuccessful ? "pointer-events-none" : ""
                  }`}
                >
                  Thêm ảnh nhận diện đối tượng:
                </label>
                <div className="w-full flex justify-evenly items-center">
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="new-blacklist-individual-avatar"
                    disabled={isSubmitSuccessful ? true : false}
                  >
                    <AddAPhotoIcon />
                    <input
                      id="new-blacklist-individual-avatar"
                      name="image"
                      accept="image/*"
                      style={{ display: "none" }}
                      type="file"
                      onChange={(event) =>
                        onChangeHandleImportAvatarNewBlacklistIndividual(event)
                      }
                      disabled={isSubmitSuccessful ? true : false}
                    />
                  </Button>
                  {avatarNewBlacklistIndividual && <div>Đã tải lên 1 ảnh</div>}
                </div>
              </div>
              {/* Trường tên không dấu */}
              <div className="w-full">
                <label
                  htmlFor="new-blacklist-individual-unsigned-first-name"
                  className="w-full text-gray-700 font-medium"
                >
                  Tên không dấu
                </label>
                <div className="w-full h-fit flex flex-col">
                  <input
                    {...register("newBlacklistIndividualUnsignedFirstName", {
                      required: "Vui lòng nhập tên không dấu",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Chỉ được chứa chữ cái không dấu",
                      },
                      minLength: {
                        value: 1,
                        message: "Tên phải có ít nhất 1 ký tự",
                      },
                      maxLength: {
                        value: 50,
                        message: "Tên không được vượt quá 50 ký tự",
                      },
                      validate: {
                        noConsecutiveSpaces: (value) =>
                          !value.includes("  ") ||
                          "Không được có khoảng trắng liên tiếp",
                        notOnlySpaces: (value) =>
                          value.trim().length > 0 ||
                          "Không được chỉ nhập khoảng trắng",
                      },
                    })}
                    id="new-blacklist-individual-unsigned-first-name"
                    type="text"
                    placeholder="Nhập tên không dấu"
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5 
                    focus:outline-none focus:shadow-outline focus:border-[#1dbfaf]
                    ${
                      errors.newBlacklistIndividualUnsignedFirstName
                        ? `focus:outline-none focus:shadow-outline 
                      focus:border-red-500 border-red-500`
                        : ""
                    }`}
                    onFocus={() =>
                      clearErrors("newBlacklistIndividualUnsignedFirstName")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.newBlacklistIndividualUnsignedFirstName && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {
                        errors.newBlacklistIndividualUnsignedFirstName
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>
              {/* Trường họ và tên */}
              <div className="w-full">
                <label
                  htmlFor="new-blacklist-individual-full-name"
                  className="w-full text-gray-700 font-medium"
                >
                  Họ và Tên
                </label>
                <div className="w-full">
                  <input
                    {...register("newBlacklistIndividualFullName", {
                      required: "Vui lòng nhập họ và tên",
                      pattern: {
                        value: /^[a-zA-ZÀ-ỹ]+(?: [a-zA-ZÀ-ỹ]+)*$/,
                        message:
                          "Chỉ được dùng chữ (có/không dấu), không chứa số/ký tự đặc biệt, không thừa dấu cách",
                      },
                      minLength: {
                        value: 1,
                        message: "Phải có ít nhất 1 ký tự",
                      },
                      validate: {
                        noConsecutiveSpaces: (value) =>
                          !value.includes("  ") ||
                          "Không được có khoảng trắng liên tiếp",
                        notOnlySpaces: (value) =>
                          value.trim().length > 0 ||
                          "Không được chỉ nhập khoảng trắng",
                      },
                    })}
                    id="new-blacklist-individual-full-name"
                    type="text"
                    placeholder="Nhập họ và tên"
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5 
                    focus:outline-none focus:shadow-outline focus:border-[#1dbfaf] ${
                      errors.newBlacklistIndividualFullName
                        ? `focus:outline-none focus:shadow-outline 
                      focus:border-red-500 border-red-500`
                        : ""
                    }`}
                    onFocus={() =>
                      clearErrors("newBlacklistIndividualFullName")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.newBlacklistIndividualFullName && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {errors.newBlacklistIndividualFullName.message as string}
                    </p>
                  )}
                </div>
              </div>
              {/* Trường năm sinh */}
              <div className="w-full">
                <label
                  htmlFor="new-blacklist-individual-year-of-birth"
                  className="w-full text-gray-700 font-medium"
                >
                  Năm sinh:
                </label>
                <div className="w-full">
                  <input
                    {...register("newBlacklistIndividualYearOfBirth", {
                      required: "Vui lòng nhập năm sinh",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Chỉ được nhập số",
                      },
                      minLength: {
                        value: 4,
                        message: "Năm sinh phải có 4 chữ số",
                      },
                      maxLength: {
                        value: 4,
                        message: "Năm sinh phải có 4 chữ số",
                      },
                      validate: {
                        validYear: (value: string) => {
                          const year = parseInt(value, 10);
                          const currentYear = new Date().getFullYear();
                          if (year < currentYear - 150 || year > currentYear) {
                            return `Năm sinh phải từ ${
                              currentYear - 150
                            } đến ${currentYear}`;
                          }
                          return true;
                        },
                      },
                    })}
                    id="new-blacklist-individual-year-of-birth"
                    type="number"
                    placeholder="Nhập năm sinh"
                    min={new Date().getFullYear() - 150}
                    max={new Date().getFullYear()}
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5
                    focus:outline-none focus:shadow-outline focus:border-[#1dbfaf] 
                    ${
                      errors.newBlacklistIndividualYearOfBirth
                        ? `focus:outline-none focus:shadow-outline 
                      focus:border-red-500 border-red-500`
                        : ""
                    }`}
                    onFocus={() =>
                      clearErrors("newBlacklistIndividualYearOfBirth")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.newBlacklistIndividualYearOfBirth && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {
                        errors.newBlacklistIndividualYearOfBirth
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>
              {/* Trường quê quán */}
              <div className="w-full">
                <label
                  htmlFor="new-blacklist-individual-hometown"
                  className="w-full text-gray-700 font-medium"
                >
                  Quê quán:
                </label>
                <div className="w-full">
                  <input
                    {...register("newBlacklistIndividualHometown", {
                      required: "Vui lòng nhập quê quán",
                      pattern: {
                        value: /^[a-zA-ZÀ-ỹ]+(?: [a-zA-ZÀ-ỹ]+)*$/,
                        message:
                          "Chỉ được dùng chữ (có/không dấu), không chứa số/ký tự đặc biệt, không thừa dấu cách",
                      },
                      minLength: {
                        value: 1,
                        message: "Phải có ít nhất 1 ký tự",
                      },
                      validate: {
                        noConsecutiveSpaces: (value) =>
                          !value.includes("  ") ||
                          "Không được có khoảng trắng liên tiếp",
                        notOnlySpaces: (value) =>
                          value.trim().length > 0 ||
                          "Không được chỉ nhập khoảng trắng",
                      },
                    })}
                    id="new-blacklist-individual-hometown"
                    type="text"
                    placeholder="Nhập quê quán"
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5 
                    focus:outline-none focus:shadow-outline focus:border-[#1dbfaf] ${
                      errors.newBlacklistIndividualHometown
                        ? `focus:outline-none focus:shadow-outline 
                      focus:border-red-500 border-red-500`
                        : ""
                    }`}
                    onFocus={() =>
                      clearErrors("newBlacklistIndividualHometown")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.newBlacklistIndividualHometown && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {errors.newBlacklistIndividualHometown.message as string}
                    </p>
                  )}
                </div>
              </div>
              {/* Trường căn cước công dân */}
              <div className="w-full">
                <label
                  htmlFor="new-blacklist-individual-id-number"
                  className="w-full text-gray-700 font-medium"
                >
                  Số căn cước công dân:
                </label>
                <div className="w-full">
                  <input
                    {...register("newBlacklistIndividualIdNumber", {
                      required: "Vui lòng nhập số căn cước công dân",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Chỉ được nhập số",
                      },
                      minLength: {
                        value: 12,
                        message: "Số căn cước công dân phải có 12 chữ số",
                      },
                      maxLength: {
                        value: 12,
                        message: "Số căn cước công dân phải có 12 chữ số",
                      },
                    })}
                    id="new-blacklist-individual-id-number"
                    type="number"
                    placeholder="Nhập số căn cước công dân"
                    min={0}
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5
                      focus:outline-none focus:shadow-outline focus:border-[#1dbfaf] 
                      ${
                        errors.newBlacklistIndividualIdNumber
                          ? `focus:outline-none focus:shadow-outline 
                        focus:border-red-500 border-red-500`
                          : ""
                      }`}
                    onFocus={() =>
                      clearErrors("newBlacklistIndividualIdNumber")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.newBlacklistIndividualIdNumber && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {errors.newBlacklistIndividualIdNumber.message as string}
                    </p>
                  )}
                </div>
              </div>
              {/* Trường tập ảnh nhận diện đối tượng */}
              <div className="flex justify-evenly items-center w-full">
                <label
                  htmlFor="new-blacklist-individual-recognition-images-dataset"
                  className={`w-full text-gray-700 font-medium ${
                    isSubmitSuccessful ? "pointer-events-none" : ""
                  }`}
                >
                  Thêm tập ảnh nhận diện đối tượng:
                </label>
                <div className="w-full flex justify-evenly items-center">
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="new-blacklist-individual-recognition-images-dataset"
                    disabled={isSubmitSuccessful ? true : false}
                  >
                    <AddPhotoAlternateIcon />
                    <input
                      id="new-blacklist-individual-recognition-images-dataset"
                      name="image"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      type="file"
                      onChange={(event) =>
                        onChangeHandleImportImageDatasetNewBlacklistIndividual(
                          event
                        )
                      }
                      disabled={isSubmitSuccessful ? true : false}
                    />
                  </Button>
                  {imagesDatasetNewBlacklistIndividual &&
                    imagesDatasetNewBlacklistIndividual.length > 0 && (
                      <div>
                        Đã tải lên: {imagesDatasetNewBlacklistIndividual.length}{" "}
                        ảnh
                      </div>
                    )}
                </div>
              </div>
              <div className="flex justify-evenly items-center w-full">
                <Button
                  disabled={isSubmitSuccessful ? true : false}
                  onClick={() => setOpenAddBlacklistData(false)}
                >
                  Hủy
                </Button>

                <Button
                  disabled={isSubmitSuccessful ? true : false}
                  type="submit"
                >
                  Xác nhận
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddNewSubjects;
