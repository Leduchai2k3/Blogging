import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDarkMode,
  toggleNavBar,
} from "../../../redux-toolkit/globalSlide";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../firebase-app/firebase-auth";
import styled from "styled-components";
import { signOut } from "firebase/auth";

const sidebarLink = [
  {
    title: "Home",
    url: "/",
    icon: (
      <svg
        width="28"
        height="20"
        viewBox="0 0 32 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.8 26.9833V17.4833H18.9667V26.9833H26.675V14.3167H31.3L15.8833 0.0666656L0.466675 14.3167H5.09167V26.9833H12.8Z"
          className="fill-black dark:fill-white"
        />
      </svg>
    ),
  },
  {
    title: "Lộ trình",
    url: "/lo-trinh",
    icon: (
      <svg
        width="32"
        height="26"
        viewBox="0 0 32 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.9604 20.9562L22.3334 14.5833L15.9604 8.21041L13.7438 10.4271L16.3167 13H9.66669V16.1667H16.3167L13.7438 18.7396L15.9604 20.9562ZM3.33336 25.6667C2.46252 25.6667 1.71677 25.3563 1.09611 24.7357C0.47544 24.115 0.165634 23.3698 0.16669 22.5V3.5C0.16669 2.62916 0.477023 1.88341 1.09769 1.26275C1.71836 0.642081 2.46358 0.332275 3.33336 0.333331H12.8334L16 3.5H28.6667C29.5375 3.5 30.2833 3.81033 30.9039 4.431C31.5246 5.05166 31.8344 5.79689 31.8334 6.66666V22.5C31.8334 23.3708 31.523 24.1166 30.9024 24.7372C30.2817 25.3579 29.5365 25.6677 28.6667 25.6667H3.33336Z"
          className="fill-black dark:fill-white"
        />
      </svg>
    ),
  },
  {
    title: "Blog",
    url: "/blog",
    icon: (
      <svg
        width="25"
        height="25"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.0833 3.91667V26.0833H3.91667V3.91667H26.0833ZM29.25 0.75H0.75V29.25H29.25V0.75ZM22.9167 22.9167H7.08333V21.3333H22.9167V22.9167ZM22.9167 19.75H7.08333V18.1667H22.9167V19.75ZM22.9167 15H7.08333V7.08333H22.9167V15Z"
          className="fill-black dark:fill-white"
        />
      </svg>
    ),
  },
  {
    title: "Code",
    url: "/code",
    icon: (
      <svg
        width="38"
        height="24"
        viewBox="0 0 38 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.893 10.2236L5.41562 14.6752L10.893 19.1267C11.0782 19.2711 11.232 19.4499 11.3452 19.6529C11.4585 19.8558 11.529 20.0788 11.5525 20.3086C11.5761 20.5384 11.5523 20.7705 11.4825 20.9913C11.4127 21.2121 11.2983 21.417 11.1461 21.5941C10.9938 21.7713 10.8068 21.917 10.5959 22.0228C10.385 22.1286 10.1545 22.1923 9.91802 22.2101C9.68151 22.228 9.44372 22.1997 9.21859 22.1269C8.99346 22.0541 8.78554 21.9382 8.60703 21.7861L1.48203 16.0049C1.28239 15.8421 1.12184 15.6387 1.01168 15.4089C0.901513 15.1792 0.844421 14.9287 0.844421 14.6752C0.844421 14.4216 0.901513 14.1712 1.01168 13.9414C1.12184 13.7117 1.28239 13.5083 1.48203 13.3455L8.60703 7.56425C8.97059 7.28101 9.4336 7.14763 9.89691 7.19269C10.3602 7.23775 10.787 7.45766 11.0858 7.80532C11.3847 8.15298 11.5318 8.60076 11.4958 9.05276C11.4597 9.50476 11.2433 9.92505 10.893 10.2236ZM37.018 13.3455L29.893 7.56425C29.5294 7.28101 29.0664 7.14763 28.6031 7.19269C28.1398 7.23775 27.713 7.45766 27.4142 7.80532C27.1153 8.15298 26.9682 8.60076 27.0042 9.05276C27.0403 9.50476 27.2566 9.92505 27.607 10.2236L33.0992 14.6752L27.607 19.1267C27.4261 19.2718 27.2765 19.4505 27.1672 19.6523C27.0578 19.8542 26.9908 20.0753 26.9701 20.3026C26.9494 20.53 26.9754 20.759 27.0465 20.9765C27.1176 21.194 27.2325 21.3955 27.3844 21.5693C27.5528 21.7623 27.762 21.9178 27.9976 22.025C28.2333 22.1322 28.4899 22.1888 28.75 22.1908C29.168 22.1907 29.5725 22.0474 29.893 21.7861L37.018 16.0049C37.2176 15.8421 37.3782 15.6387 37.4883 15.4089C37.5985 15.1792 37.6556 14.9287 37.6556 14.6752C37.6556 14.4216 37.5985 14.1712 37.4883 13.9414C37.3782 13.7117 37.2176 13.5083 37.018 13.3455ZM24.6086 0.323234C24.1636 0.169208 23.6742 0.192052 23.2463 0.386819C22.8185 0.581586 22.4866 0.9326 22.3227 1.36386L12.8227 26.8014C12.6645 27.2347 12.6879 27.7112 12.888 28.1278C13.088 28.5444 13.4485 28.8675 13.8914 29.0271C14.0865 29.0957 14.2926 29.1299 14.5 29.1283C14.8662 29.129 15.2238 29.0197 15.5239 28.8154C15.824 28.6111 16.0522 28.3216 16.1773 27.9865L25.6773 2.54901C25.8355 2.11571 25.8121 1.63917 25.612 1.22259C25.412 0.806005 25.0515 0.482899 24.6086 0.323234Z"
          className="fill-black dark:fill-white"
        />
      </svg>
    ),
  },
  {
    title: "Liên hệ",
    url: "/support",
    icon: (
      <svg
        width="31"
        height="25"
        viewBox="0 0 31 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.9583 29.25V26.0833H26.2916V14.8417C26.2916 13.3111 26.009 11.8729 25.4437 10.5271C24.8785 9.18125 24.1076 8.00695 23.1312 7.00417C22.1548 6.00139 21.0114 5.20972 19.701 4.62917C18.3906 4.04861 16.9903 3.75834 15.5 3.75834C14.0097 3.75834 12.6094 4.04861 11.2989 4.62917C9.98852 5.20972 8.84512 6.00139 7.86873 7.00417C6.89234 8.00695 6.12151 9.18125 5.55623 10.5271C4.99095 11.8729 4.70831 13.3111 4.70831 14.8417V24.5H3.16665C2.31873 24.5 1.59312 24.1897 0.989813 23.569C0.386508 22.9483 0.0843408 22.2031 0.083313 21.3333V18.1667C0.083313 17.5597 0.224633 17.0256 0.507271 16.5643C0.78991 16.1031 1.16248 15.7268 1.62498 15.4354L1.7406 13.3375C1.97185 11.4111 2.50527 9.66945 3.34085 8.1125C4.17644 6.55556 5.21706 5.23611 6.46273 4.15417C7.7084 3.07223 9.10874 2.23411 10.6638 1.63984C12.2188 1.04556 13.8309 0.748947 15.5 0.750003C17.1958 0.750003 18.8212 1.04714 20.3763 1.64142C21.9313 2.2357 23.325 3.08014 24.5573 4.17475C25.7906 5.26936 26.8251 6.58881 27.6606 8.13309C28.4962 9.67736 29.0291 11.399 29.2594 13.2979L29.375 15.3563C29.8375 15.5938 30.2101 15.9437 30.4927 16.406C30.7753 16.8683 30.9166 17.3761 30.9166 17.9292V21.5708C30.9166 22.1514 30.7753 22.666 30.4927 23.1146C30.2101 23.5632 29.8375 23.9063 29.375 24.1438V26.0833C29.375 26.9542 29.0728 27.6999 28.4685 28.3206C27.8641 28.9413 27.1385 29.2511 26.2916 29.25H13.9583ZM10.875 18.1667C10.4382 18.1667 10.0718 18.0147 9.77577 17.7107C9.47977 17.4067 9.33229 17.0309 9.33331 16.5833C9.33331 16.1347 9.48131 15.7584 9.77731 15.4544C10.0733 15.1504 10.4392 14.9989 10.875 15C11.3118 15 11.6782 15.152 11.9742 15.456C12.2702 15.76 12.4177 16.1358 12.4166 16.5833C12.4166 17.0319 12.2686 17.4083 11.9726 17.7123C11.6766 18.0163 11.3108 18.1677 10.875 18.1667ZM20.125 18.1667C19.6882 18.1667 19.3218 18.0147 19.0258 17.7107C18.7298 17.4067 18.5823 17.0309 18.5833 16.5833C18.5833 16.1347 18.7313 15.7584 19.0273 15.4544C19.3233 15.1504 19.6892 14.9989 20.125 15C20.5618 15 20.9282 15.152 21.2242 15.456C21.5202 15.76 21.6677 16.1358 21.6666 16.5833C21.6666 17.0319 21.5186 17.4083 21.2226 17.7123C20.9266 18.0163 20.5608 18.1677 20.125 18.1667ZM6.28852 15.7125C6.18574 14.1556 6.39798 12.7438 6.92523 11.4771C7.45248 10.2104 8.15908 9.13481 9.04502 8.25025C9.93097 7.36675 10.9521 6.6875 12.1083 6.2125C13.2646 5.7375 14.4208 5.5 15.5771 5.5C17.9153 5.5 19.939 6.25895 21.6481 7.77684C23.3573 9.29473 24.3913 11.1873 24.75 13.4547C22.3347 13.4293 20.1507 12.7633 18.1979 11.4565C16.2451 10.1497 14.7677 8.4545 13.7656 6.37084C13.3545 8.50834 12.4871 10.402 11.1633 12.0518C9.83949 13.7017 8.21355 14.9219 6.28852 15.7125Z"
          className="fill-black dark:fill-white"
        />
      </svg>
    ),
  },
];

const sideBarNav = [
  {
    title: "Bài viết của tôi",
    url: "/manage-post",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M56 56.88H8V8H36V0H8C3.6 0 0 3.6 0 8V56C0 60.4 3.6 64 8 64H56C60.4 64 64 60.4 64 56V28H56V56.88Z"
          className="fill-black dark:fill-white"
        />
        <path d="M48 16H16V24H48V16Z" className="fill-black dark:fill-white" />
        <path
          d="M16 28V36H48V28H36H16Z"
          className="fill-black dark:fill-white"
        />
        <path d="M48 40H16V48H48V40Z" className="fill-black dark:fill-white" />
      </svg>
    ),
  },
  {
    title: "Cài đặt",
    url: "/change-password",
    icon: (
      <svg
        width="30"
        height="32"
        viewBox="0 0 30 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.0058 11.5245C13.9473 11.5245 12.9561 11.9351 12.2056 12.6856C11.4587 13.4361 11.0445 14.4273 11.0445 15.4857C11.0445 16.5442 11.4587 17.5354 12.2056 18.2859C12.9561 19.0328 13.9473 19.447 15.0058 19.447C16.0642 19.447 17.0554 19.0328 17.8059 18.2859C18.5528 17.5354 18.967 16.5442 18.967 15.4857C18.967 14.4273 18.5528 13.4361 17.8059 12.6856C17.4393 12.3162 17.003 12.0234 16.5224 11.824C16.0417 11.6247 15.5261 11.5229 15.0058 11.5245ZM29.6012 19.8612L27.286 17.8823C27.3958 17.2097 27.4524 16.523 27.4524 15.8397C27.4524 15.1565 27.3958 14.4662 27.286 13.7972L29.6012 11.8183C29.7761 11.6686 29.9013 11.4692 29.9601 11.2466C30.0189 11.024 30.0085 10.7888 29.9304 10.5722L29.8986 10.4802C29.2614 8.69846 28.3067 7.04693 27.0807 5.60559L27.017 5.53125C26.8681 5.35621 26.6697 5.23038 26.4479 5.17034C26.2261 5.11031 25.9913 5.11889 25.7744 5.19495L22.9 6.21802C21.838 5.34717 20.6556 4.66041 19.3741 4.18251L18.8183 1.17705C18.7764 0.95064 18.6666 0.742347 18.5034 0.579845C18.3403 0.417342 18.1316 0.308323 17.905 0.26727L17.8094 0.24957C15.9686 -0.0831901 14.0287 -0.0831901 12.1879 0.24957L12.0923 0.26727C11.8658 0.308323 11.657 0.417342 11.4939 0.579845C11.3308 0.742347 11.2209 0.95064 11.179 1.17705L10.6197 4.19667C9.35035 4.67838 8.16787 5.36348 7.11863 6.22509L4.22291 5.19495C4.00614 5.11829 3.77117 5.1094 3.54923 5.16947C3.32729 5.22954 3.12888 5.35572 2.98037 5.53125L2.91665 5.60559C1.69284 7.04846 0.738382 8.69958 0.0988054 10.4802L0.0669453 10.5722C-0.0923548 11.0147 0.0386254 11.5103 0.396166 11.8183L2.73965 13.8184C2.62991 14.4839 2.57681 15.1636 2.57681 15.8362C2.57681 16.5159 2.62991 17.1956 2.73965 17.854L0.403246 19.8541C0.228354 20.0038 0.103182 20.2032 0.0443741 20.4258C-0.0144341 20.6484 -0.00409211 20.8836 0.0740252 21.1002L0.105885 21.1922C0.746626 22.9728 1.69181 24.619 2.92373 26.0668L2.98745 26.1412C3.13632 26.3162 3.33474 26.442 3.55655 26.5021C3.77836 26.5621 4.01315 26.5535 4.22999 26.4775L7.12571 25.4473C8.18063 26.3146 9.35591 27.0014 10.6268 27.4757L11.1861 30.4954C11.228 30.7218 11.3379 30.9301 11.501 31.0926C11.6641 31.2551 11.8728 31.3641 12.0994 31.4051L12.195 31.4228C14.0539 31.7574 15.9576 31.7574 17.8165 31.4228L17.9121 31.4051C18.1387 31.3641 18.3474 31.2551 18.5105 31.0926C18.6737 30.9301 18.7835 30.7218 18.8254 30.4954L19.3812 27.4899C20.6627 27.0085 21.845 26.3252 22.907 25.4544L25.7815 26.4775C25.9983 26.5541 26.2333 26.563 26.4552 26.5029C26.6771 26.4429 26.8756 26.3167 27.0241 26.1412L27.0878 26.0668C28.3197 24.6119 29.2649 22.9728 29.9056 21.1922L29.9375 21.1002C30.0897 20.6612 29.9587 20.1692 29.6012 19.8612ZM15.0058 21.7091C11.5684 21.7091 8.78243 18.9231 8.78243 15.4857C8.78243 12.0484 11.5684 9.26242 15.0058 9.26242C18.4431 9.26242 21.2291 12.0484 21.2291 15.4857C21.2291 18.9231 18.4431 21.7091 15.0058 21.7091Z"
          className="fill-black dark:fill-white"
        />
      </svg>
    ),
  },
];

const StyleNavPhone = styled.div`
  .nav-item {
    display: flex;
    align-items: center;
    text-align: center;
    height: 100%;
    gap: 30px;
    padding: 2px 10px;
    /* background: #668588;
    border-radius: 10px;
    */
    &.active,
    &:hover {
      background: #668588;
      padding: 2px 10px;
      border-radius: 10px;
    }
  }
`;
const NavBarPhone = ({ className }) => {
  const [user, setUser] = useState([]);
  const { userInfo } = useAuth();
  const dispatch = useDispatch();
  const classMode = "dark";
  const element = window.document.documentElement;
  const showNavbar = useSelector((state) => state.darkMode.showNavbar);
  const handleNavBar = () => {
    dispatch(toggleNavBar());
  };
  const signOutt = () => {
    signOut(auth);
    handleNavBar();
  };
  const handleDarkMode = () => {
    element.classList.toggle(classMode);
    dispatch(toggleDarkMode());
  };
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
  return (
    <div className="relative z-50 xs:overflow-scroll">
      <div
        className={`z-40 w-screen h-screen transition-all bg-[#CDCFD1]  fixed  ${
          showNavbar ? "opacity-25 visible" : "invisible opacity-0"
        }`}
        onClick={handleNavBar}
      ></div>
      <div
        className={`${className} h-screen w-[70%] z-40 transition-all fixed ${
          showNavbar ? "visible" : "invisible opacity-0"
        }`}
      >
        <div
          className={`${
            showNavbar ? "" : "-translate-x-[120%]"
          } transition-all h-full w-[100%] absolute dark:bg-[#1F2833] bg-white !opacity-100 z-50 `}
        >
          <div className="mt-[70px] p-5">
            <div className="flex items-center justify-between pb-5 mb-5 border border-transparent border-b-gray-500">
              {userInfo?.email ? (
                <div>
                  <NavLink
                    className="flex items-center gap-4"
                    to="/change-password"
                    onClick={handleNavBar}
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
                </div>
              ) : (
                <NavLink
                  to={"/sign-up"}
                  className="w-full h-full"
                  onClick={handleNavBar}
                >
                  <button className="h-full px-8 py-4 font-semibold text-white border rounded-xl dark:text-black bg-[#1F2833] dark:bg-[#80c9c4] ">
                    Sign Up
                  </button>
                </NavLink>
              )}
              <div className="mode">
                <button
                  className="flex items-center w-12 justify-center aspect-square border rounded-full transition-all bg-[#1F2833] dark:bg-[#a9fff9]"
                  onClick={handleDarkMode}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 47.25C17.5417 47.25 12.0521 44.9896 7.53125 40.4688C3.01042 35.9479 0.75 30.4583 0.75 24C0.75 17.5417 3.01042 12.0521 7.53125 7.53125C12.0521 3.01042 17.5417 0.75 24 0.75C24.6028 0.75 25.1952 0.771528 25.7773 0.814584C26.3594 0.857639 26.9295 0.922222 27.4875 1.00833C25.7222 2.25694 24.3117 3.88272 23.256 5.88567C22.2003 7.88861 21.6733 10.0517 21.675 12.375C21.675 16.25 23.0312 19.5437 25.7437 22.2562C28.4562 24.9687 31.75 26.325 35.625 26.325C37.9931 26.325 40.1674 25.7971 42.1479 24.7414C44.1285 23.6857 45.7431 22.2761 46.9917 20.5125C47.0778 21.0722 47.1424 21.6423 47.1854 22.2227C47.2285 22.8031 47.25 23.3955 47.25 24C47.25 30.4583 44.9896 35.9479 40.4688 40.4688C35.9479 44.9896 30.4583 47.25 24 47.25ZM24 42.0833C27.7889 42.0833 31.1903 41.0388 34.2042 38.9497C37.2181 36.8607 39.4139 34.1379 40.7917 30.7812C39.9306 30.9965 39.0694 31.1687 38.2083 31.2979C37.3472 31.4271 36.4861 31.4917 35.625 31.4917C30.3292 31.4917 25.8187 29.6291 22.0935 25.9039C18.3683 22.1788 16.5066 17.6691 16.5083 12.375C16.5083 11.5139 16.5729 10.6528 16.7021 9.79167C16.8312 8.93056 17.0035 8.06944 17.2188 7.20833C13.8604 8.58611 11.1367 10.7819 9.04767 13.7958C6.95861 16.8097 5.91494 20.2111 5.91667 24C5.91667 28.9944 7.68194 33.2569 11.2125 36.7875C14.7431 40.3181 19.0056 42.0833 24 42.0833Z"
                      fill="#9B9FA4"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* NavItem */}
            <StyleNavPhone>
              {sidebarLink.map((item) => {
                return (
                  <NavLink
                    to={item.url}
                    className="mb-2 nav-item"
                    key={item.title}
                    onClick={handleNavBar}
                  >
                    <div className="flex items-center w-full h-full gap-8">
                      <span className="w-[25px] mt-3 h-[40px] ">
                        {item.icon}
                      </span>
                      <span className="text-lg font-normal text-black dark:text-white whitespace-nowrap">
                        {item.title}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </StyleNavPhone>
            <div className="mb-4 border border-transparent border-b-gray-500"></div>
            <StyleNavPhone className="">
              {sideBarNav.map((item) => {
                return (
                  <NavLink
                    to={item.url}
                    className="mb-2 nav-item"
                    key={item.title}
                    onClick={handleNavBar}
                  >
                    <div className="flex items-center w-full h-full gap-8">
                      <span className="w-[25px] mt-3 h-[40px] ">
                        {item.icon}
                      </span>
                      <span className="text-lg font-normal text-black dark:text-white whitespace-nowrap">
                        {item.title}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </StyleNavPhone>
            {userInfo?.email && (
              <div className="mb-4 border border-transparent border-b-gray-500"></div>
            )}
            {userInfo?.email && (
              <NavLink
                className="mb-2 flex items-center h-full gap-[30px] px-[10px] py-[5px]"
                onClick={signOutt}
                to="/login"
              >
                <div className="flex items-center w-full h-full gap-8">
                  <span className="w-[25px] mt-3 h-[40px] ">
                    <svg
                      width="20"
                      height="25"
                      viewBox="0 0 30 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.6667 25V20H10V13.3333H21.6667V8.33333L30 16.6667L21.6667 25ZM18.3333 0C19.2174 0 20.0652 0.351189 20.6904 0.976311C21.3155 1.60143 21.6667 2.44928 21.6667 3.33333V6.66667H18.3333V3.33333H3.33333V30H18.3333V26.6667H21.6667V30C21.6667 30.8841 21.3155 31.7319 20.6904 32.357C20.0652 32.9821 19.2174 33.3333 18.3333 33.3333H3.33333C2.44928 33.3333 1.60143 32.9821 0.976311 32.357C0.351189 31.7319 0 30.8841 0 30V3.33333C0 2.44928 0.351189 1.60143 0.976311 0.976311C1.60143 0.351189 2.44928 0 3.33333 0H18.3333Z"
                        className="fill-black dark:fill-white"
                      />
                    </svg>
                  </span>

                  <NavLink className="text-lg font-normal text-black dark:text-white whitespace-nowrap">
                    Đăng xuất
                  </NavLink>
                </div>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarPhone;
