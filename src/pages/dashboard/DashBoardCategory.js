import { async } from "@firebase/util";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/form/Button";
import Input from "../../components/form/Input";
import ActionDelete from "../../components/icon/action/ActionDelete";
import ActionEdit from "../../components/icon/action/ActionEdit";
import Table from "../../components/table/Table";
import { db } from "../../firebase-app/firebase-auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const DashBoardCategory = () => {
  const { control } = useForm({
    mode: "onChange",
    defaultValues: "",
  });
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
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
      setCategoryList(result);
    };
    fetchCategory();
  }, []);
  const handleDelete = async (cateId) => {
    const singleDoc = doc(db, "categories", cateId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(singleDoc);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-[#02E7F5] text-[26px] font-bold">
          Manage Your Category
        </h2>
        <div className="w-[300px] mt-[-20px] flex flex-col items-end gap-6">
          <Button to="/add-new-category/admin" type="button">
            Add New Category
          </Button>
          <Input control={control} kind="second" name="name"></Input>
        </div>
      </div>
      <div className="mt-[10px]">
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          {categoryList.length > 0 &&
            categoryList.map((item) => (
              <tbody key={item.id}>
                <tr>
                  <td></td>
                  <td>{item.id.slice(0, 8) + "....."}</td>
                  <td>
                    <span>{item.category}</span>
                  </td>
                  <td>
                    <span className="text-gray-500">{item.slug}</span>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <ActionEdit
                        onClick={() => {
                          navigate(`/manage/update-category?id=${item?.id}`);
                        }}
                      ></ActionEdit>
                      <ActionDelete
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
        </Table>
      </div>
    </div>
  );
};

export default DashBoardCategory;
