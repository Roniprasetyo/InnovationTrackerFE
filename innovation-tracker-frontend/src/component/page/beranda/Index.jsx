import { useEffect, useRef, useState } from "react";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import CalendarView from "../../part/CalendarView";
import NewsListView from "../../part/NewsListView";

export default function BerandaIndex() {
  return (
    <>
      <div>
        <div className="carousel slide">
          <div className="carousel-inner">
            <div className="active carousel-item">
              <img
                sizes="(max-width: 575px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 33vw, 25vw"
                loading="lazy"
                className="d-block w-100 blur-load blur-load-loaded"
                src="https://api.polytechnic.astra.ac.id:2906/operational_api/Uploads/MOB_2024626102616Web Training.jpg"
                alt="Slide 0"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container p-12">
        <div className="row">
          <div className="d-flex justify-content-center container-sm my-12">
            <div className="mb-4 color-primary align-items-center justify-content-center text-center">
              <div className="gap-3 justify-content-center">
                <h2 className="display-5 text-center fw-bold">WELCOME TO ASTRATECH</h2>
                {/* <div className="d-flex align-items-end mb-2">
                  <h2 className="display-10 fw-medium align-items-end text-start">
                    TO ASTRATECH
                  </h2>
                </div> */}
              </div>
              <div className="display-6 fw-medium text-nowrap">
                INNOVATION LIBRARY
              </div>
            </div>
            {/* <div className="row">
              <div className="d-flex gap-4">
                <NewsListView />
                <CalendarView />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
