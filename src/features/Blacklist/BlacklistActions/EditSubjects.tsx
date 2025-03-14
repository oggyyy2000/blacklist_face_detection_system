import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { SubmitHandler, useForm } from "react-hook-form";
import * as UpdateDataService from "../../../APIServices/UpdateDataService.api";
import * as UpdateModelService from "../../../APIServices/UpdateModel.api";
import { TransformProfileBlacklistGetResponseType } from "../../../types/global/Global.type";
import { GridRenderCellParams } from "@mui/x-data-grid";

import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import EditIcon from "@mui/icons-material/Edit";

interface EditBlacklistIndividualFormData {
  editBlacklistIndividualUnsignedFirstName: string;
  editBlacklistIndividualFullName: string;
  editBlacklistIndividualYearOfBirth: string;
  editBlacklistIndividualHometown: string;
  editBlacklistIndividualIdNumber: string;
}

interface EditSubjectsProps {
  openEditBlacklistData: number | null;
  setOpenEditBlacklistData: React.Dispatch<React.SetStateAction<number | null>>;
  setBlackList: React.Dispatch<
    React.SetStateAction<TransformProfileBlacklistGetResponseType[]>
  >;
  setIsLoadingUpdateModel: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadingEditData: React.Dispatch<React.SetStateAction<boolean>>;
  tableRowData: GridRenderCellParams<TransformProfileBlacklistGetResponseType>;
}

const EditSubjects = ({
  openEditBlacklistData,
  setOpenEditBlacklistData,
  setBlackList,
  setIsLoadingUpdateModel,
  setIsLoadingEditData,
  tableRowData,
}: EditSubjectsProps) => {
  const [avatarEditBlacklistIndividual, setAvatarEditBlacklistIndividual] =
    useState<File | undefined | null>();
  const [
    imagesDatasetEditBlacklistIndividual,
    setImagesDatasetEditBlacklistIndividual,
  ] = useState<File[] | undefined | null>();

  console.log("tableRowData: ", tableRowData);

  // form variable
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
    reset,
    clearErrors,
  } = useForm<EditBlacklistIndividualFormData>({
    mode: "onTouched",
    reValidateMode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: false,
  });

  useEffect(() => {
    if (openEditBlacklistData && tableRowData) {
      reset({
        editBlacklistIndividualUnsignedFirstName:
          tableRowData.row.unsignedFirstName,
        editBlacklistIndividualFullName: tableRowData.row.fullName,
        editBlacklistIndividualYearOfBirth: String(
          tableRowData.row.yearOfBirth
        ),
        editBlacklistIndividualHometown: tableRowData.row.hometown,
        editBlacklistIndividualIdNumber: tableRowData.row.IdNumber,
      });
    }
  }, [openEditBlacklistData, reset, tableRowData]);

  const handleActionEditBlacklistData = (
    data: GridRenderCellParams<TransformProfileBlacklistGetResponseType>
  ) => {
    setOpenEditBlacklistData(data.row.id);
  };

  const onChangeHandleImportAvatarEditBlacklistIndividual = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setAvatarEditBlacklistIndividual(files[0]);
  };

  const onChangeHandleImportImageDatasetEditBlacklistIndividual = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setImagesDatasetEditBlacklistIndividual(
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

  const handleSubmitActionEditBlacklistData: SubmitHandler<
    EditBlacklistIndividualFormData
  > = async (data) => {
    setIsLoadingEditData(true);

    const formData = new FormData();
    formData.append("image", avatarEditBlacklistIndividual as Blob);
    formData.append("name", data.editBlacklistIndividualUnsignedFirstName);
    formData.append("full_name", data.editBlacklistIndividualFullName);
    formData.append("year_of_birth", data.editBlacklistIndividualYearOfBirth);
    formData.append("hometown", data.editBlacklistIndividualHometown);
    formData.append("id_number", data.editBlacklistIndividualIdNumber);
    formData.append("violation", "");
    if (imagesDatasetEditBlacklistIndividual) {
      for (let i = 0; i < imagesDatasetEditBlacklistIndividual.length; i++) {
        console.log(imagesDatasetEditBlacklistIndividual[i]);
        formData.append("data", imagesDatasetEditBlacklistIndividual[i]);
      }
    }

    const response = await UpdateDataService.patchData({
      data: formData,
      options: { headers: { "Content-Type": "multipart/form-data" } },
    });
    if (response) {
      toast.success((response as unknown as { message: string }).message, {
        onClose: () => {
          setIsLoadingEditData(false);
          setAvatarEditBlacklistIndividual(null);
          setImagesDatasetEditBlacklistIndividual(null);
          setOpenEditBlacklistData(null);
          handleUpdateModel();
          reset({}, { keepIsSubmitted: false });
        },
      });
    }
  };

  return (
    <>
      <Button
        className="!min-w-10 !w-10 !h-9"
        variant="contained"
        color="primary"
        title="Sửa dữ liệu"
        onClick={() => handleActionEditBlacklistData(tableRowData)}
      >
        <EditIcon fontSize="small" />
      </Button>

      {tableRowData && openEditBlacklistData && (
        <Dialog
          open={openEditBlacklistData === tableRowData.row.id}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              bgcolor: "#1976d2",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            Sửa thông tin đối tượng
          </DialogTitle>
          <DialogContent>
            <form
              className="flex flex-col justify-evenly items-center h-[550px]"
              onSubmit={handleSubmit(handleSubmitActionEditBlacklistData)}
            >
              {/* Trường ảnh đại diện nhận diện đối tượng */}
              <div className="w-full flex justify-evenly items-center">
                <label
                  htmlFor="edit-blacklist-individual-avatar"
                  className={`w-full text-gray-700 font-medium ${
                    isSubmitSuccessful ? "pointer-events-none" : ""
                  }`}>
                  Chỉnh sửa ảnh nhận diện đối tượng:
                </label>
                <div className="w-full flex justify-evenly items-center">
                  <Button
                    variant="contained"
                    component="label"
                    htmlFor="edit-blacklist-individual-avatar"
                    disabled={isSubmitSuccessful ? true : false}
                  >
                    <AddAPhotoIcon />
                    <input
                      id="edit-blacklist-individual-avatar"
                      name="image"
                      accept="image/*"
                      style={{ display: "none" }}
                      type="file"
                      onChange={(event) =>
                        onChangeHandleImportAvatarEditBlacklistIndividual(event)
                      }
                      disabled={isSubmitSuccessful ? true : false}
                    />
                  </Button>
                  {avatarEditBlacklistIndividual && <div>Đã tải lên 1 ảnh</div>}
                </div>
              </div>
              {/* Trường tên không dấu */}
              <div className="w-full">
                <label
                  htmlFor="edit-blacklist-individual-unsigned-first-name"
                  className="w-full text-gray-700 font-medium"
                >
                  Tên không dấu
                </label>
                <div className="w-full h-fit flex flex-col">
                  <input
                    {...register("editBlacklistIndividualUnsignedFirstName", {
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
                    id="edit-blacklist-individual-unsigned-first-name"
                    type="text"
                    placeholder="Nhập tên không dấu"
                    defaultValue={tableRowData.row.unsignedFirstName}
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5 
                    focus:outline-none focus:shadow-outline focus:border-[#1dbfaf]
                    ${
                      errors.editBlacklistIndividualUnsignedFirstName
                        ? `focus:outline-none focus:shadow-outline 
                    focus:border-red-500 border-red-500`
                        : ""
                    }`}
                    onFocus={() =>
                      clearErrors("editBlacklistIndividualUnsignedFirstName")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.editBlacklistIndividualUnsignedFirstName && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {
                        errors.editBlacklistIndividualUnsignedFirstName
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>
              {/* Trường họ và tên */}
              <div className="w-full">
                <label
                  htmlFor="edit-blacklist-individual-full-name"
                  className="w-full text-gray-700 font-medium"
                >
                  Họ và Tên:
                </label>
                <div className="w-full">
                  <input
                    {...register("editBlacklistIndividualFullName", {
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
                    id="edit-blacklist-individual-full-name"
                    type="text"
                    defaultValue={tableRowData.row.fullName}
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5 
                  focus:outline-none focus:shadow-outline focus:border-[#1dbfaf] ${
                    errors.editBlacklistIndividualFullName
                      ? `focus:outline-none focus:shadow-outline 
                    focus:border-red-500 border-red-500`
                      : ""
                  }`}
                    onFocus={() =>
                      clearErrors("editBlacklistIndividualFullName")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.editBlacklistIndividualFullName && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {errors.editBlacklistIndividualFullName.message as string}
                    </p>
                  )}
                </div>
              </div>
              {/* Trường năm sinh */}
              <div className="w-full">
                <label
                  htmlFor="edit-blacklist-individual-year-of-birth"
                  className="w-full text-gray-700 font-medium"
                >
                  Năm sinh:
                </label>
                <div className="w-full">
                  <input
                    {...register("editBlacklistIndividualYearOfBirth", {
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
                    id="edit-blacklist-individual-year-of-birth"
                    type="number"
                    defaultValue={tableRowData.row.yearOfBirth}
                    min={new Date().getFullYear() - 150}
                    max={new Date().getFullYear()}
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5
                  focus:outline-none focus:shadow-outline focus:border-[#1dbfaf] 
                  ${
                    errors.editBlacklistIndividualYearOfBirth
                      ? `focus:outline-none focus:shadow-outline 
                    focus:border-red-500 border-red-500`
                      : ""
                  }`}
                    onFocus={() =>
                      clearErrors("editBlacklistIndividualYearOfBirth")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.editBlacklistIndividualYearOfBirth && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {
                        errors.editBlacklistIndividualYearOfBirth
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>
              {/* Trường quê quán */}
              <div className="w-full">
                <label
                  htmlFor="edit-blacklist-individual-hometown"
                  className="w-full text-gray-700 font-medium"
                >
                  Quê quán:
                </label>
                <div className="w-full">
                  <input
                    {...register("editBlacklistIndividualHometown", {
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
                    id="edit-blacklist-individual-hometown"
                    type="text"
                    defaultValue={tableRowData.row.hometown}
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5 
                  focus:outline-none focus:shadow-outline focus:border-[#1dbfaf] ${
                    errors.editBlacklistIndividualHometown
                      ? `focus:outline-none focus:shadow-outline 
                    focus:border-red-500 border-red-500`
                      : ""
                  }`}
                    onFocus={() =>
                      clearErrors("editBlacklistIndividualHometown")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.editBlacklistIndividualHometown && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {errors.editBlacklistIndividualHometown.message as string}
                    </p>
                  )}
                </div>
              </div>
              {/* Trường căn cước công dân */}
              <div className="w-full">
                <label
                  htmlFor="edit-blacklist-individual-id-number"
                  className="w-full text-gray-700 font-medium"
                >
                  Số căn cước công dân:
                </label>
                <div className="w-full">
                  <input
                    {...register("editBlacklistIndividualIdNumber", {
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
                    id="edit-blacklist-individual-id-number"
                    type="number"
                    defaultValue={tableRowData.row.IdNumber}
                    min={0}
                    className={`w-full h-[40px] border border-gray-400 rounded-xs !py-3 !px-2.5
                  focus:outline-none focus:shadow-outline focus:border-[#1dbfaf] 
                  ${
                    errors.editBlacklistIndividualIdNumber
                      ? `focus:outline-none focus:shadow-outline 
                    focus:border-red-500 border-red-500`
                      : ""
                  }`}
                    onFocus={() =>
                      clearErrors("editBlacklistIndividualIdNumber")
                    }
                    disabled={isSubmitSuccessful ? true : false}
                  />
                  {errors.editBlacklistIndividualIdNumber && (
                    <p className="text-red-500 text-xs font-medium leading-normal">
                      {errors.editBlacklistIndividualIdNumber.message as string}
                    </p>
                  )}
                </div>
              </div>
              {/* Trường tập ảnh nhận diện đối tượng */}
              <div className="flex justify-evenly items-center w-full">
                <label
                  htmlFor="edit-blacklist-individual-recognition-images-dataset"
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
                    htmlFor="edit-blacklist-individual-recognition-images-dataset"
                    disabled={isSubmitSuccessful ? true : false}
                  >
                    <AddPhotoAlternateIcon />
                    <input
                      id="edit-blacklist-individual-recognition-images-dataset"
                      name="image"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      type="file"
                      onChange={(event) =>
                        onChangeHandleImportImageDatasetEditBlacklistIndividual(
                          event
                        )
                      }
                      disabled={isSubmitSuccessful ? true : false}
                    />
                  </Button>
                  {imagesDatasetEditBlacklistIndividual &&
                    imagesDatasetEditBlacklistIndividual.length > 0 && (
                      <p>
                        Đã tải lên:{" "}
                        {imagesDatasetEditBlacklistIndividual.length} ảnh
                      </p>
                    )}
                </div>
              </div>
              <div className="flex justify-evenly items-center w-full">
                <Button
                  disabled={isSubmitSuccessful ? true : false}
                  onClick={() => {
                    setOpenEditBlacklistData(null);
                  }}
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

export default EditSubjects;
