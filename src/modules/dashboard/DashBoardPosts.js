import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../components/form/Button";
import ActionDelete from "../../components/icon/action/ActionDelete";
import ActionEdit from "../../components/icon/action/ActionEdit";
import ActionView from "../../components/icon/action/ActionView";
import Table from "../../components/table/Table";
import { db } from "../../firebase-app/firebase-auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../components/form/InputSearch";
import { debounce } from "lodash";
const StyledDashBoardPosts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const DashBoardPosts = () => {
  const [searchPost, setSearchPost] = useState("");
  document.title = "Manage Posts";

  const navigate = useNavigate();

  const [postsList, setPostList] = useState([]);
  useEffect(() => {
    async function fetchPosts() {
      const colRef = collection(db, "posts");
      const newRef = searchPost
        ? query(
            colRef,
            where("title", ">=", searchPost),
            where("title", "<=", searchPost + "utf8")
          )
        : colRef;
      onSnapshot(newRef, (snapshot) => {
        const result = [];
        snapshot.forEach((post) => {
          result.push({
            id: post.id,
            ...post.data(),
          });
        });
        setPostList(result);
        console.log(result);
      });
    }
    fetchPosts();
  }, [searchPost]);

  const handleDelete = (postId) => {
    const singleDoc = doc(db, "posts", postId);
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
    setSearchPost(values.target.value);
  }, 300);
  return (
    <StyledDashBoardPosts>
      <div className="flex justify-between">
        <h2 className="text-[#02E7F5] text-[26px] font-bold">
          Manage Your Posts
        </h2>
        <div className="w-[300px] mt-[-20px] flex flex-col items-end gap-6">
          <Button to="/add-new-post/admin" type="button">
            Add New Post
          </Button>
          <InputSearch
            className="dark:focus:!text-white"
            placeholder="Search Posts ...."
            type="text"
            onChange={handleChange}
          ></InputSearch>
        </div>
      </div>
      <div>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
              <th>Post</th>
              <th>Category</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          {postsList.length > 0 &&
            postsList.map((post) => (
              <tbody key={post.id}>
                <tr>
                  <td></td>
                  <td title={post?.id} className="!text-black dark:!text-white">
                    {post?.id?.slice(0, 8) + "...."}
                  </td>

                  <td>
                    <div className="flex items-center gap-x-3">
                      <img
                        src={post.image}
                        alt=""
                        className="w-[66px] h-[55px] rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3
                          className="font-semibold !text-black dark:!text-white"
                          title={post?.title}
                        >
                          {post?.title?.slice(0, 15) + "..."}
                        </h3>
                        <time className="text-sm text-gray-500">
                          {new Date(
                            post?.createdAt?.seconds * 1000
                          ).toLocaleDateString("vi-VI")}
                        </time>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="text-gray-500">
                      {post?.category?.category}
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-500">
                      {post?.user?.fullname}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <ActionView
                        onClick={() => {
                          navigate(`/blog/${post.slug}`);
                        }}
                      ></ActionView>
                      <ActionEdit
                        onClick={() => {
                          navigate(`/manage/update-post/admin?id=${post?.id}`);
                        }}
                      ></ActionEdit>
                      <ActionDelete
                        onClick={() => {
                          handleDelete(post.id);
                        }}
                      ></ActionDelete>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
        </Table>
      </div>
    </StyledDashBoardPosts>
  );
};

export default DashBoardPosts;
