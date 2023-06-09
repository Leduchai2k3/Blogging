import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/form/Input";
import Label from "../../components/form/Label";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../../components/form/Button";
import TitleAdd from "../../components/title/TitleAdd";
import ImageUpload from "../../components/image/ImageUpload";
import useFirebaseImg from "../../hook/useFirebaseImg";
import Dropdown from "../../components/dropdown/Dropdown";
import Select from "../../components/dropdown/Select";
import List from "../../components/dropdown/List";
import Option from "../../components/dropdown/Option";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-auth";
import slugify from "slugify";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import BgDashBoard from "../../components/layout/dashboard/BgDashBoard";

const EditPost = ({ admin = true }) => {
  const [params] = useSearchParams();
  const postId = params.get("id");
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      hot: false,
      createdAt: serverTimestamp(),
    },
  });
  const watchHot = watch("hot");
  const [category, setCategory] = useState({});
  const [selectCategory, setSelecCategory] = useState({});

  useEffect(() => {
    if (postId !== null) {
      async function getPosts() {
        const colRef = doc(db, "posts", postId);
        const singleDoc = await getDoc(colRef);
        if (singleDoc.data()) {
          reset(singleDoc.data());
          setContent(singleDoc.data()?.content);
          setSelecCategory(singleDoc.data()?.category || "IT");
        }
      }
      getPosts();
    }
  }, [postId, reset]);
  const imageUrl = getValues("image");

  const { progress, image, setImage, handleDeleteImg, onSelectImage } =
    useFirebaseImg(setValue, getValues);

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  const [content, setContent] = useState("");
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ header: 1 }, { header: 2 }, { header: 3 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["link", "image"],
    ],
  };
  useEffect(() => {
    const fetchCategory = async () => {
      const colRef = collection(db, "categories");
      const docSnap = await getDocs(colRef);
      const result = [];
      docSnap.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategory(result);
    };
    fetchCategory();
  }, []);
  const handleCategory = (item) => {
    setValue("category", { ...item });
    setSelecCategory(item);
  };

  const handleUpdate = async (value) => {
    if (value.title === "") {
      toast.error("Enter your title");
      return;
    } else if (value.category === undefined) {
      toast.error("Choose Category");
      return;
    } else if (value.content === undefined) {
      toast.error("Enter your content");
    }
    const colRef = doc(db, "posts", postId);
    value.slug = slugify(value.slug || value.title, { lower: true });
    if (image === "") {
      await updateDoc(colRef, {
        ...value,
        content,
        createdAt: serverTimestamp(),
      });
    } else {
      await updateDoc(colRef, {
        ...value,
        image,
        content,
        createdAt: serverTimestamp(),
      });
    }

    toast.success("Successfully!!!");
  };

  return (
    <form className="min-h-screen" onSubmit={handleSubmit(handleUpdate)}>
      <TitleAdd
        isSubmitting={isSubmitting}
        admin={admin}
        on={watchHot === true}
        onClick={() => {
          setValue("hot", !watchHot);
        }}
      >
        Edit Post
      </TitleAdd>

      <BgDashBoard>
        <div className="flex flex-col w-full gap-10">
          <div className="grid grid-cols-2 gap-[100px]">
            <div>
              <Label
                htmlFor="title"
                classname="text-lg font-semibold text-white"
              >
                Title
              </Label>
              <Input control={control} name="title" kind="second"></Input>
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
          <div className="grid grid-cols-2 gap-[100px]">
            <div>
              <Label
                htmlFor="image"
                classname="mb-2 text-lg font-semibold text-white"
              >
                Image
              </Label>
              <ImageUpload
                onChange={onSelectImage}
                progress={progress}
                image={image}
                handleDeleteimg={handleDeleteImg}
              ></ImageUpload>
            </div>
            <div>
              <Label
                htmlFor="category"
                classname="text-lg font-semibold text-white"
              >
                Category
              </Label>
              <Dropdown>
                <Select
                  placehoder={`${selectCategory.category || "Select Category"}`}
                ></Select>
                <List>
                  {category.length > 0 &&
                    category.map((item) => (
                      <Option
                        key={item.id}
                        onClick={() => {
                          handleCategory(item);
                        }}
                      >
                        {item.category}
                      </Option>
                    ))}
                </List>
              </Dropdown>
            </div>
          </div>
          <div>
            <ReactQuill
              modules={modules}
              theme="snow"
              value={content}
              onChange={setContent}
              className="entry-content"
            />
          </div>
        </div>
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          Upload
        </Button>
      </BgDashBoard>
    </form>
  );
};

export default EditPost;
