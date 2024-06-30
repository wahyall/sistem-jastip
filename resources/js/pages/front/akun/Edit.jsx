import { memo } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import BottomNavLayout from "../layouts/BottomNavLayout";
import FileUpload from "@/pages/dashboard/components/FileUpload";
import { useState } from "react";

export default memo(function Edit({ auth: { user } }) {
  const [file, setFile] = useState([]);
  const { register, watch, handleSubmit, control } = useForm({
    defaultValues: { ...user },
  });

  return (
    <BottomNavLayout
      title="Edit Profile"
      back={true}
      backUrl="/akun"
      bottomNav={false}
    >
      <section className="-ml-4 -mr-4 -mt-4">
        <div className="flex items-center justify-center bg-primary h-40">
          <div className="w-24 -mb-4">
            <FileUpload
              files={user?.photo_url ? [user?.photo_url] : file}
              onupdatefiles={setFile}
              allowMultiple={false}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              stylePanelLayout="compact circle"
              styleButtonRemoveItemPosition="center bottom"
              acceptedFileTypes={["image/*"]}
            />
          </div>
        </div>
        <div className="p-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Nama</span>
            </div>
            <input
              type="text"
              placeholder="Masukkan Nama Anda"
              className="input input-bordered w-full"
            />
          </label>
        </div>
      </section>
    </BottomNavLayout>
  );
});
