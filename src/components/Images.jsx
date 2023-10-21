import { useState, useEffect, useRef } from "react";
import Loading from "./Loading";
import { generatePagination } from "./utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Images.scss";

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = "PeRWLUQf0hPE36wdSzaws03NVxBnPkVVI6D6vEUk7gE";
const PER_PAGE = 30;
let PAGINATION_NUMBER = 15;
if (innerWidth < 1200) {
  PAGINATION_NUMBER = 12;
}
if (innerWidth < 992) {
  PAGINATION_NUMBER = 7;
}

function Images() {
  const [page, setPage] = useState(1);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [images, setImages] = useState([]); 
  const [totalPages, setTotalPages] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    if (notFound || images.length) {
      input.current.select();
    }
  }, [notFound, images]);

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    document.body.classList[dark ? "add" : "remove"]("dark-theme");
  }, [dark]);

  const url = `${API_URL}?page=${page}&query=${keyword}&per_page=${PER_PAGE}&client_id=${API_KEY}`;

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      let data = await response.json();
      setTotalPages(data.total_pages);

      data = data.results;

      setLoading(false);
      setImages(data);

      if (!data.length) {
        setNotFound(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword) {
      toast.error("Input field can't be empty", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    setPage(1);
    setNotFound(false);
    fetchImages();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer />
      <div>
        <section className="toggle-container">
          <button className="dark-toggle" onClick={() => setDark(!dark)}>
            {!dark ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 16 16"
                className="toggle-icon"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                className="toggle-icon"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
              </svg>
            )}
          </button>
        </section>
        <section>
          <h1 className="title">unsplash images</h1>
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              ref={input}
              type="text"
              className="form-input search-input"
              name="search"
              placeholder="Type keyword to search..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setNotFound(false);
              }}
            />
            <button type="submit" className="btn">
              search
            </button>
          </form>
        </section>

        {images.length ? (
          <section>
            <div className="image-container">
              {images.map(
                ({ urls: { regular: src }, alt_description: alt }, i) => {
                  return (
                    <a key={i} href={src} target="_blank">
                      <img
                        key={i}
                        src={src}
                        alt={alt}
                        title={alt}
                        className="img"
                      />
                    </a>
                  );
                }
              )}
            </div>
            <div className="pagination">
              {page !== 1 && (
                <a
                  className="pagination-prev"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page - 1);
                  }}
                  href="#"
                >
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <path d="M7 1L1 7L7 13" strokeWidth="2" stroke="#fff"></path>
                  </svg>
                </a>
              )}

              {
                generatePagination(page, totalPages, PAGINATION_NUMBER).map(
                  (number) => {
                    console.log(number);

                    return (
                      <>
                        <a
                          className={page === number ? "active" : ""}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(number);
                          }}
                          key={number}
                          href="#"
                        >
                          {number}
                        </a>
                      </>
                    );
                  }
                )

                // !(function () {

                //     // Example usage:
                //     const currentPage = 10;
                //     const totalPages = 135;
                //     const itemsPerPage = 12;

                //     const paginationItems = generatePagination(
                //       currentPage,
                //       totalPages,
                //       itemsPerPage
                //     );
                //     console.log(paginationItems);
                // })()
              }

              {page !== totalPages && (
                <a
                  className="pagination-next"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                  href="#"
                >
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <path d="M1 1L7 7L1 13" strokeWidth="2" stroke="#fff"></path>
                  </svg>
                </a>
              )}
            </div>
          </section>
        ) : (
          (notFound || !keyword) && (
            <section className="image-container d-block">
              <div className="not-found">
                <h4>
                  {notFound ? (
                    <>
                      <span className="d-block">No Results Found.</span>
                      <span>Write something different and try again</span>
                    </>
                  ) : (
                    !keyword && (
                      <>
                        <span className="d-block">
                          The input field is empty.
                        </span>
                        <span className="d-block">
                          Write something and find images
                        </span>
                      </>
                    )
                  )}
                </h4>
              </div>
            </section>
          )
        )}
      </div>
    </>
  );
}

export default Images;
