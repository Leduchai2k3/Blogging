import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../../context/auth-context";
import { auth, db } from "../../../firebase-app/firebase-auth";
import { useRole } from "../../../utils/constants";
import DropdownHeader from "../../dropdown/dropdownHeader/DropdownHeader";
import ListHeader from "../../dropdown/dropdownHeader/ListHeader";
import OptionHeader from "../../dropdown/dropdownHeader/OptionHeader";
import SelectHeader from "../../dropdown/dropdownHeader/SelectHeader";
import { debounce } from "lodash";
import ListSearch from "../../dropdown/dropdownSearch/ListSearch";
import OptionSearch from "../../dropdown/dropdownSearch/OptionSearch";
import InputSearch from "../../form/InputSearch";
import { useDispatch, useSelector } from "react-redux";
import { toggleNavBar, toggleSearch } from "../../../redux-toolkit/globalSlide";

const StyleHomePage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.backround};
  .header {
    position: fixed;
    width: 100%;
    height: 70px;
    border-bottom: 1px solid ${(props) => props.theme.placehv};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 30px;
    background-color: ${(props) => props.theme.backround};
    z-index: 100;
    .header-left {
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${(props) => props.theme.bginput};
      img {
        width: 50px;
        height: 50px;
        /* border-radius: 10px; */
        margin-right: 10px;
      }
      h3 {
        font-size: 20px;
        font-weight: 600;
      }
    }
    .input {
      width: 400px;
      height: 35px;
      color: white;
      input {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background-color: ${(props) => props.theme.bgSearch};
        padding: 10px 30px;
        outline: none;
        transition: 0.3s all;
        border: 1px solid transparent;
      }
      input:focus {
        border: 1px solid ${(props) => props.theme.bgButton};
        background-color: #2e545b;
      }
    }
    .header-right {
      width: 150px;
      height: 50px;
      background-color: ${(props) => props.theme.bgButton};
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
    }
  }
`;
const Header = () => {
  const dispatch = useDispatch();
  const showSearch = useSelector((state) => state.darkMode.showSearch);
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState([]);
  const { userInfo } = useAuth();
  const [postsList, setPostList] = useState([]);

  useEffect(() => {
    if (userInfo) {
      async function fetchUser() {
        const q = query(
          collection(db, "users"),
          where("email", "==", String(userInfo?.email))
        );
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((item) => {
          setUser({
            id: item.id,
            avatar: item.data().avatar,
            email: item.data().email,
            fullname: item.data().fullname,
            role: item.data().role,
            createdAt: item.data().createdAt,
          });
        });
      }
      fetchUser();
    }
  }, [userInfo]);
  useEffect(() => {
    // if (search !== "") {
    async function fetchPosts() {
      const newRef = query(
        collection(db, "posts"),
        where("title", ">=", search),
        where("title", "<=", search + "\uf8ff")
      );
      const newRefCode = query(
        collection(db, "code"),
        where("title", ">=", search),
        where("title", "<=", search + "\uf8ff")
      );
      const newRefUser = query(
        collection(db, "user"),
        where("fullname", ">=", search),
        where("fullname", "<=", search + "\uf8ff")
      );

      const result = [];
      onSnapshot(newRef, (snapshot) => {
        snapshot.forEach((post) => {
          result.push({
            id: post.id,
            ...post.data(),
          });
        });
      });
      onSnapshot(newRefCode, (snapshot) => {
        snapshot.forEach((code) => {
          result.push({
            id: code.id,
            ...code.data(),
          });
        });
      });
      onSnapshot(newRefUser, (snapshot) => {
        snapshot.forEach((user) => {
          result.push({
            id: user.id,
            ...user.data(),
          });
        });
        setPostList(result);
      });
    }
    fetchPosts();
    // }
  }, [search]);
  console.log(postsList);
  function handleFocus() {
    setIsFocused(true);
  }
  function handleFocusPhone() {
    if (showSearch === true) {
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
  }
  function handleBlur() {
    setIsFocused(false);
  }
  const handleChange = debounce((values) => {
    // console.log(values.target.value);
    setSearch(values.target.value);
  }, 300);
  const handleToggleNavbar = () => {
    dispatch(toggleNavBar());
  };

  const handleSearch = () => {
    dispatch(toggleSearch());
  };
  return (
    <StyleHomePage>
      <div className="header dark:!bg-[#1F2833]">
        <button onClick={handleToggleNavbar}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 60 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M59.8475 0H0V5.44068H59.8475V0Z"
              class="fill-black dark:fill-white transition-all"
            />
            <path
              d="M59.8475 24.483H0V29.9237H59.8475V24.483Z"
              class="fill-black dark:fill-white transition-all"
            />
            <path
              d="M59.8475 48.9661H0V54.4068H59.8475V48.9661Z"
              class="fill-black dark:fill-white transition-all"
            />
          </svg>
        </button>
        <button
          className={`${showSearch ? "absolute right-8" : "absolute right-8"}`}
          onClick={handleSearch}
        >
          {showSearch ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M56 5.64L50.36 0L28 22.36L5.64 0L0 5.64L22.36 28L0 50.36L5.64 56L28 33.64L50.36 56L56 50.36L33.64 28L56 5.64Z"
                class="fill-black dark:fill-white transition-all"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 44H46.84L45.72 42.92C49.64 38.36 52 32.44 52 26C52 11.64 40.36 0 26 0C11.64 0 0 11.64 0 26C0 40.36 11.64 52 26 52C32.44 52 38.36 49.64 42.92 45.72L44 46.84V50L64 69.96L69.96 64L50 44ZM26 44C16.04 44 8 35.96 8 26C8 16.04 16.04 8 26 8C35.96 8 44 16.04 44 26C44 35.96 35.96 44 26 44Z"
                class="fill-black dark:fill-white transition-all"
              />
            </svg>
          )}
        </button>

        <div
          className="hidden w-full h-full xs:block"
          onFocus={handleFocusPhone}
          onBlur={handleBlur}
        >
          <DropdownHeader>
            <div>
              <InputSearch
                className={`!m-0 dark:!text-white !text-black h-[40px] absolute right-16 transition-all  ${
                  showSearch
                    ? "!w-[55%] opacity-100 visible "
                    : "!w-[0%] opacity-0 invisible"
                } `}
                placeholder="Tìm kiếm blog, tài liệu...."
                onChange={handleChange}
              ></InputSearch>
              <ListSearch
                className="xs:mt-12 xs:absolute"
                showh={search}
                focused={isFocused}
              >
                {postsList?.length > 0 &&
                  postsList.map((item) => (
                    <OptionSearch
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      to={item.urldemo || `/blog/${item.slug}`}
                    ></OptionSearch>
                  ))}
              </ListSearch>
            </div>
          </DropdownHeader>
        </div>
      </div>
      <div className="header dark:!bg-[#1F2833] xs:!hidden">
        <div className="xs:!hidden header-left">
          <div className="">
            <NavLink to={"/"}>
              <img src="/logonew.png" alt="logo" className="xs:hidden" />
            </NavLink>
          </div>
          <h3 className="text-black xs:hidden dark:text-white">DH Blogging</h3>
        </div>
        <div className="input" onFocus={handleFocus} onBlur={handleBlur}>
          <DropdownHeader>
            <div>
              <InputSearch
                className=" !m-0 !text-white xs:hidden"
                placeholder="Tìm kiếm blog, tài liệu...."
                onChange={handleChange}
              ></InputSearch>
              <ListSearch showh={search} focused={isFocused}>
                {postsList?.length > 0 &&
                  postsList.map((item) => (
                    <OptionSearch
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      to={item.urldemo || `/blog/${item.slug}`}
                    ></OptionSearch>
                  ))}
              </ListSearch>
            </div>
          </DropdownHeader>
        </div>
        <div className="z-10 flex items-end gap-5 xs:hidden ">
          {userInfo?.email &&
            (Number(user.role) === Number(useRole.ADMIN) ||
              Number(user.role) === Number(useRole.MOD)) && (
              <div className="header-right z-1 ">
                <NavLink
                  to={"/manage/user"}
                  className="w-full h-full z-1 bg-[#66FCF1] shadow-md rounded-lg "
                >
                  <button className="w-full h-full text-black">
                    Dashboard
                  </button>
                </NavLink>
              </div>
            )}
          {userInfo?.email ? (
            <div>
              <div className="z-50 w-12 h-12 bg-white rounded-full">
                <div className="z-50 w-full h-full rounded-full">
                  <DropdownHeader>
                    <SelectHeader
                      className=""
                      avatar={user?.avatar}
                    ></SelectHeader>
                    <ListHeader>
                      <OptionHeader to="" blank="">
                        <NavLink
                          className="flex items-center gap-4"
                          to="/change-password"
                        >
                          <div className="overflow-hidden rounded-full w-14 h-14">
                            <img
                              src={user?.avatar || "/avtdf.png"}
                              alt="avtart"
                              className="object-cover w-full h-full rounded-full"
                            />
                          </div>
                          <div className="flex flex-col gap-[2px]">
                            <p className="!text-black dark:!text-white !opacity-100 whitespace-nowrap font-semibold">
                              {user?.fullname ||
                                String(user?.email).slice(0, 8) ||
                                ""}
                            </p>
                            <span className="text-sm italic !text-gray-400 whitespace-nowrap">
                              {new Date(
                                user?.createdAt?.seconds * 1000
                              ).toLocaleDateString("vi-VI")}
                            </span>
                          </div>
                        </NavLink>
                      </OptionHeader>

                      {Number(user.role) === Number(useRole.ADMIN) ? (
                        <OptionHeader to="/add-new-post/admin">
                          <p className="!text-black dark:!text-white whitespace-nowrap">
                            Viết Blog Admin
                          </p>
                        </OptionHeader>
                      ) : (
                        <OptionHeader to="/add-new-post">
                          <p className="!text-black whitespace-nowrap dark:!text-white">
                            Viết Blog
                          </p>
                        </OptionHeader>
                      )}
                      <OptionHeader to="/manage-post">
                        <p className="!text-black whitespace-nowrap dark:!text-white">
                          Bài viết của tôi
                        </p>
                      </OptionHeader>
                      <OptionHeader to="/change-password">
                        <p className="!text-black whitespace-nowrap dark:!text-white">
                          Cài đặt
                        </p>
                      </OptionHeader>
                      <div>
                        <OptionHeader
                          threedot
                          blank=""
                          className="!border-b-transparent"
                        >
                          <p
                            className="whitespace-nowrap !text-black dark:!text-white"
                            onClick={() => signOut(auth)}
                          >
                            Đăng xuất
                          </p>
                        </OptionHeader>
                      </div>
                    </ListHeader>
                  </DropdownHeader>
                </div>
              </div>
            </div>
          ) : (
            <div className="header-right">
              <NavLink to={"/sign-up"} className="w-full h-full">
                <button className="w-full h-full">Sign Up</button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </StyleHomePage>
  );
};

export default Header;
