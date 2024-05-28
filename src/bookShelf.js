import axios from "axios";
import uuid from "react-uuid";
import ReactDOM from "react-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ModeIcon from "@mui/icons-material/Mode";
import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bounce, ToastContainer, toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function BookShelf() {
  const [publishedData, setPublishData] = useState("");
  const [bookName, setBookName] = useState("");
  const name = localStorage.getItem("name");
  const [author, setAuthor] = useState("");
  let [userId, setUserId] = useState(null);
  const [edit, setedit] = useState(false);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const onCloseModal = () => {
    setOpen(false);
    setedit(false);
    resetData();
  };

  function resetData(params) {
    setPublishData("");
    setBookName("");
    setAuthor("");
  }

  function getToast(params) {
    toast(`🦄 ${params} !`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }

  function refreshData() {
    setTimeout(() => {
      axios.get("http://165.73.244.77:3000/books").then((res) => {
        setBooks(res.data);
      });
    }, 500);
  }

  const { data } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await axios.get("http://165.73.244.77:3000/books");
      return response.data;
    },
  });

  useEffect(() => {
    if (data != null) {
      setBooks(data);
    }
  }, [data]);

  const postBook = useMutation({
    mutationFn: (value) => {
      return axios.post("http://165.73.244.77:3000/books", value);
    },
    onSuccess: () => {
      getToast("posted succefully");
    },
    onError: () => {
      getToast("post error");
    },
  });

  const deletBookQuery = useMutation({
    mutationFn: (value) => {
      console.log(value);
      return axios.delete(`http://165.73.244.77:3000/books/${value}`);
    },
    onSuccess: () => {
      getToast("deleted succefully");
    },
    onError: () => {
      getToast("occuring error for deleting");
    },
  });

  const editBookQuery = useMutation({
    mutationFn: (value) => {
      console.log(value);
      return axios.put(`http://165.73.244.77:3000/books/${userId}`, value);
    },
    onSuccess: () => {
      getToast("edited succefully");
    },
    onError: () => {
      getToast("error for editing");
    },
  });

  function checkDataEmpty() {
    if (
      publishedData.trim() != "" &&
      bookName.trim() != "" &&
      author.trim() != ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  function saveBook() {
    if (checkDataEmpty()) {
      let bookObject = {
        published: publishedData,
        name: bookName,
        author: author,
        userID: uuid(),
        bookId: uuid(),
      };
      if (!edit) {
        postBook.mutate(bookObject);
      } else {
        editBookQuery.mutate(bookObject);
        setedit(false);
      }
      setOpen(false);
      resetData();
      refreshData();
    } else {
      getToast("input must be empty");
    }
  }

  function deletBook(id) {
    deletBookQuery.mutate(id);
    refreshData();
  }

  function editBook(item) {
    setPublishData(item.published);
    setBookName(item.name);
    setAuthor(item.author);
    setUserId(item.id);
    setOpen(true);
    setedit(true);
    refreshData();
  }

  function logOutShelf(params) {
    navigate("/login");
  }

  return (
    <div className="container-fluid">
      <div className="row-top">
        <h2>all Books in BookShelf</h2>
        <h2 onClick={logOutShelf}>
          {name ?? "Admin"} <LogoutIcon />{" "}
        </h2>
      </div>

      <div className="rowBody">
        <button onClick={onOpenModal} className="addBookButton">
          <AddRoundedIcon /> Book{" "}
        </button>
        <Modal
          open={open}
          onClose={onCloseModal}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "addBookModal",
          }}
        >
          <div className="Wrapper">
            <h2>{edit ? "edit book" : "add book"}</h2>
          </div>

          <label htmlFor="name">book name</label>
          <input
            value={bookName}
            required
            type="text"
            className="form-control"
            id="name"
            placeholder="example"
            onChange={(e) => setBookName(e.target.value)}
          />

          <label htmlFor="author">author</label>
          <input
            value={author}
            required
            type="text"
            className="form-control"
            id="author"
            placeholder="author of the book"
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label htmlFor="published">publish</label>
          <input
            required
            value={publishedData}
            type="text"
            className="form-control"
            id="published"
            placeholder="published data"
            onChange={(e) => setPublishData(e.target.value)}
          />
          <div className="Wrapper">
            <button className="saveBtn" onClick={saveBook}>
              {edit ? "edit" : "save"}
            </button>
          </div>
        </Modal>

        <table className="table table-success table-striped mt-5" id="table">
          <thead>
            <tr>
              <th>t/r</th>
              <th>name</th>
              <th>author</th>
              <th>published</th>
              <th>edit</th>
              <th>delete</th>
            </tr>
          </thead>

          <tbody>
            {books.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.author}</td>
                <td>{item.published}</td>
                <td>
                  <button className="btnTable" onClick={() => editBook(item)}>
                    <ModeIcon />
                  </button>
                </td>
                <td>
                  <button
                    className="btnTable"
                    onClick={() => deletBook(item.id)}
                  >
                    <DeleteForeverIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    </div>
  );
}

export default BookShelf;
