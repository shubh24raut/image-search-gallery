import { useEffect, useRef, useState } from "react";
import "./less/App.less";
import { searchPhotos } from "./common/common-repository";
import { DATA_PER_PAGE } from "./common/constants";
import SearchComponent from "./common/components/SearchDebounce";
import { Button, Col, Row, Spin } from "antd";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = DATA_PER_PAGE;
  const loaderRef = useRef(null);

  const fetchImages = async ({ currentQuery, currentPage }) => {
    setLoading(true);
    try {
      const response = await searchPhotos({
        query: currentQuery,
        page: currentPage,
        itemsPerPage,
      });
      setImageData((prevData) => [...prevData, ...response]);
      console.error(response);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Previous useEffect for observing loaderRef

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loaderRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef, loading]); // Include loading state in dependencies

  useEffect(() => {
    setPage(1);
    setImageData([]);
  }, [query]);

  useEffect(() => {
    fetchImages({ currentQuery: query, currentPage: page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="App">
      <div className="header">
        <div className="logo">BLITZ SPLASH</div>
        <SearchComponent
          name="Images"
          debounceTime={1}
          initialValue={query}
          getData={(value) => {
            setQuery(value);
            fetchImages({
              currentQuery: value,
            });
          }}
        />
      </div>
      <div className="image-container">
        <Row gutter={[16, 16]}>
          {imageData.map((image, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <div className="image-item">
                <div className="image-wrapper">
                  <img
                    src={image.urls.regular}
                    alt={image.alt_description}
                    loading="lazy"
                  />
                </div>
                <Button
                  style={{
                    background: `${image.color}`,
                    border: "none",
                    color: "white",
                    borderRadius: "1px",
                    height: "50px",
                    fontSize: "18px",
                  }}
                  onClick={() => {
                    const downloadLink = document.createElement("a");
                    downloadLink.href = image.urls.raw; // URL for download
                    downloadLink.target = "_blank"; // Open in new tab
                    downloadLink.download = "image"; // Set default filename
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                  }}
                >
                  Download
                </Button>
              </div>
            </Col>
          ))}
        </Row>
        <div
          ref={loaderRef}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "2px",
          }}
        >
          {/* <Spin /> */}
        </div>
        {/* Loader element */}
      </div>
    </div>
  );
}

export default App;
