import React from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import Button from "../components/form/Button";
import Input from "../components/form/Input";
import Label from "../components/form/Label";
import Bglayout from "../components/layout/Bglayout";
import TitleAdd from "../components/title/TitleAdd";
import { toast } from "react-toastify";
import slugify from "slugify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-app/firebase-auth";

const AddNewCategory = () => {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      category: "",
      slug: "",
      createdAt: new Date(),
    },
  });
  const handleAddNewCategory = async (values) => {
    if (values.category === "") {
      toast.dark("Enter your category");
      return;
    }
    try {
      const cloneValue = { ...values };
      cloneValue.slug = slugify(cloneValue.category || cloneValue.slug, {
        lower: true,
      });
      const colRef = collection(db, "categories");
      await addDoc(colRef, {
        ...cloneValue,
      });
      toast.success("Successfully!!!");
    } catch (err) {
      toast.error("False");
    } finally {
      reset({
        category: "",
        slug: "",
        createdAt: new Date(),
      });
    }
  };
  return (
    <div className="min-h-screen">
      <div className="flex justify-between">
        <TitleAdd>Add new category</TitleAdd>
      </div>
      <Bglayout classname="">
        <form onSubmit={handleSubmit(handleAddNewCategory)}>
          <div className="flex flex-col w-full gap-10">
            <div className="grid grid-cols-2 gap-[100px]">
              <div>
                <Label
                  htmlFor="category"
                  classname="text-lg font-semibold text-white"
                >
                  Category
                </Label>
                <Input control={control} name="category" kind="second"></Input>
              </div>
              <div>
                <Label
                  htmlFor="slug"
                  classname="text-lg font-semibold text-white"
                >
                  Slug
                </Label>
                <Input control={control} name="slug" kind="second"></Input>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="mt-8"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Upload
          </Button>
        </form>
      </Bglayout>
    </div>
  );
};

export default AddNewCategory;
