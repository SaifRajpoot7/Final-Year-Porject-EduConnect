import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import socket from "../../utils/socket";

const PAGE_SIZE = 5;

const AnnouncementList = ({ backendUrl, courseId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/announcements?courseId=${courseId}&page=${pageNumber}&limit=${PAGE_SIZE}`
      );

      if (res.data.announcements.length < PAGE_SIZE) setHasMore(false);

      if (pageNumber === 1) {
        setAnnouncements(res.data.announcements);
      } else {
        setAnnouncements((prev) => [...prev, ...res.data.announcements]);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    
    // Socket.io real-time updates
    socket.emit("joinCourse", courseId);
    socket.on("newAnnouncement", (announcement) => {
      setAnnouncements((prev) => [announcement, ...prev]);
    });

    return () => {
      socket.off("newAnnouncement");
    };
  }, [courseId]);

  const fetchMore = () => {
    setPage((prev) => prev + 1);
    fetchAnnouncements(page + 1);
  };

  const renderAttachment = (file) => {
    if (file.fileType.startsWith("image/")) {
      return (
        <img
          src={file.fileURL}
          alt={file.fileName}
          className="w-56 rounded-lg my-2"
        />
      );
    }

    if (file.fileType.startsWith("video/")) {
      return (
        <video
          src={file.fileURL}
          controls
          className="w-72 rounded-lg my-2"
        />
      );
    }

    return (
      <a
        href={file.fileURL}
        download={file.fileName}
        className="inline-block px-3 py-2 bg-gray-700 text-white rounded-lg my-2"
      >
        Download {file.fileName}
      </a>
    );
  };

  const Skeleton = () => (
    <div className="p-4 border bg-white rounded-xl shadow-sm animate-pulse">
      <div className="h-4 w-32 bg-gray-300 mb-2 rounded"></div>
      <div className="h-6 w-full bg-gray-300 mb-2 rounded"></div>
      <div className="h-48 w-full bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="mt-6 space-y-4">
      {loading && page === 1
        ? Array(PAGE_SIZE).fill(0).map((_, i) => <Skeleton key={i} />)
        : null}

      <InfiniteScroll
        dataLength={announcements.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<Skeleton />}
        scrollableTarget="scrollableDiv"
      >
        {announcements.map((a) => (
          <div
            key={a._id}
            className="p-4 border bg-white rounded-xl shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {a.teacherId?.name || "Teacher"}
            </p>

            {a.text && <p className="text-gray-800 mt-2">{a.text}</p>}

            <div className="mt-3">
              {a.attachments.map((file) => (
                <div key={file.fileURL}>{renderAttachment(file)}</div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(a.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default AnnouncementList;
