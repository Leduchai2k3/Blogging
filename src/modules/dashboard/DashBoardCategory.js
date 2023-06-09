import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Button from "../../components/form/Button";
import ActionDelete from "../../components/icon/action/ActionDelete";
import ActionEdit from "../../components/icon/action/ActionEdit";
import Table from "../../components/table/Table";
import { db } from "../../firebase-app/firebase-auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../components/form/InputSearch";
import { debounce } from "lodash";

const DashBoardCategory = () => {
  document.title = "Manage Category";

  const [searchCategory, setSearchCate] = useState("");
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const colRef = collection(db, "categories");
      const newRef = searchCategory
        ? query(
            colRef,
            where("category", ">=", searchCategory),
            where("category", "<=", searchCategory + "utf8")
          )
        : colRef;
      onSnapshot(newRef, (snapshot) => {
        const result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategoryList(result);
      });
    };
    fetchCategory();
  }, [searchCategory]);
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
  const handleChange = debounce((values) => {
    setSearchCate(values.target.value);
  }, 300);
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
          <InputSearch
            className="dark:focus:!text-white"
            placeholder="Search User ...."
            type="text"
            onChange={handleChange}
          ></InputSearch>
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
                  <td className="!text-black dark:!text-white">{item.id}</td>
                  <td>
                    <span className="!text-black dark:!text-white">
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <span className="italic text-gray-500 ">{item.slug}</span>
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
