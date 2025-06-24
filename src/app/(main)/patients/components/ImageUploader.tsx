"use client";
import { useEffect, useState } from "react";
import { Upload, message, Modal } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { RcFile, UploadFile, UploadProps } from "antd/lib/upload/interface";

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void;
  fieldName: string;
  initialImageUrls?: string[];
}

const ImageUploader = ({
  onUpload,
  fieldName,
  initialImageUrls = [],
}: ImageUploaderProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const initialFiles = initialImageUrls.map((url, index) => ({
      uid: `${fieldName}-${index}-${url}`,
      name: `image-${index}.png`,
      status: "done" as const,
      url: url,
    }));
    setFileList(initialFiles);
  }, [JSON.stringify(initialImageUrls), fieldName]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      const getBase64 = (fileObj: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(fileObj);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = (file: UploadFile): Promise<boolean> => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to remove this image?",
        content: "This action cannot be undone.",
        okText: "Yes, remove it",
        okType: "danger",
        cancelText: "No, keep it",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log("Attempting to upload with:", { cloudName, uploadPreset });

    if (!cloudName || !uploadPreset) {
      message.error("Cloudinary configuration is missing.");
      if (onError) {
        onError(new Error("Cloudinary configuration is missing."));
      }
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      if (onSuccess) {
        onSuccess(response.data, file);
      }
    } catch (error) {
      message.error(`Upload failed for ${file.name}`);
      console.error(error);
      if (onError) {
        onError(error);
      }
    }
  };

  const handleChange: UploadProps["onChange"] = ({
    file,
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    if (file.status === "done" || file.status === "removed") {
      const urls = newFileList
        .map((f) => f.url || f.response?.secure_url)
        .filter(Boolean);
      onUpload(urls as string[]);
    }
  };

  const props: UploadProps = {
    fileList,
    listType: "picture-card",
    multiple: true,
    customRequest,
    onChange: handleChange,
    onPreview: handlePreview,
    onRemove: handleRemove,
    showUploadList: {
      removeIcon: <CloseOutlined style={{ color: "red", fontSize: "16px" }} />,
    },
  };

  return (
    <>
      <Upload {...props}>
        <div>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>Select Files</div>
        </div>
      </Upload>
      <Modal
        open={previewOpen}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width="50vw"
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUploader; 