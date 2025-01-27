import { setBreadcrumbItems } from "store/actions"
import { connect } from "react-redux"
import "./branches.css"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, CardTitle, CardImg } from "reactstrap"
import img1 from "../../assets/analysis_images/aec.png"
import axios from "axios"
import { useParams } from "react-router-dom"
import Loader from "./loader"

const branches = [
  {
    title: "CSE",
    // img: cse,
    weekly: 1,
    monthly: 10,
  },
  {
    title: "ECE",
    //  img: ece,
    weekly: 2,
    monthly: 20,
  },
  {
    title: "EEE",
    //  img: eee,
    weekly: 3,
    monthly: 30,
  },
  {
    title: "MECH",
    // img: mech,
    weekly: 4,
    monthly: 40,
  },
  {
    title: "CIVIL",
    // img: civil,
    weekly: 5,
    monthly: 50,
  },
  {
    title: "IT",
    //  img: it,
    weekly: 6,
    monthly: 60,
  },
  {
    title: "PETROLEUM",
    //  img: petrol,
    weekly: 21,
    monthly: 24,
  },
  {
    title: "MINING",
    // img: mining,
    weekly: 22,
    monthly: 25,
  },
  {
    title: "AGRICULTURE",
    // img: agri,
    weekly: 23,
    monthly: 26,
  },
]
const baseUrl = process.env.REACT_APP_API

function Analysis(props) {
  const { college } = useParams()
  console.log(college)

  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Student Analysis", link: "#" },
    { title: "Branches", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Branches", breadcrumbItems)
  })

  const [finalData, setFinalData] = useState([])
  const [hoverIndex, setHoverIndex] = useState(null)
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setLoader(true)
    axios
      .get(baseUrl + `/branchWise-Student-Count/${college}`)
      .then(result => {
        console.log("Data is getting succesfull")
        setFinalData(result.data)
        console.log(result.data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoader(false)
      })
  }, [])

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {loader ? (
        <Loader />
      ) : (
        <div className="branchesContainer">
          {finalData &&
            Object.entries(finalData)
              .sort((a, b) => b[1].today - a[1].today) // Sort by 'today' values
              .map(([branch, data], index) => {
                console.log(branch, data) // Corrected log

                return (
                  <Link
                    to={`/studentAnalysis/branches/studentdata/${college}/${branch}`}
                    key={branch}
                  >
                    {/* <Card
                   style={{
                     width: '18rem',
                     height: '12rem',
                     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                     transform: hoverIndex === index ? 'scale(1.02)' : 'scale(1)',
                     boxShadow: hoverIndex === index ? '0px 0px 6px black' : 'none',
                   }}
                   onMouseEnter={() => setHoverIndex(index)}
                   onMouseLeave={() => setHoverIndex(null)}
                 >
                   <div className="d-flex justify-content-center">
                     <CardImg
                       className="img-fluid"
                       src={img1}
                       alt={branch}
                       style={{
                         width: '80px',
                         height: '80px',
                         borderRadius: '50%',
                         objectFit: 'cover',
                         marginTop: '10px',
                         marginBottom: '10px',
                         border: '3px solid #2B3A4A',
                       }}
                     />
                   </div>
                   <CardBody
                     className="d-flex flex-column align-items-center"
                     style={{
                       backgroundColor: '#2B3A4A',
                       color: 'white',
                       marginTop: '0px',
                       textAlign: 'center',
                       padding: '0.5rem', // Increased padding slightly
                     }}
                   >
                     <CardTitle
                       className="h4" // Keeping the original font size
                       style={{
                         color: 'white',
                         fontWeight: 'bold',
                         marginBottom: '0.4rem', // Slightly increased margin
                       }}
                     >
                       {branch}
                     </CardTitle>
                     <div
                       style={{
                         width: '100%',
                         borderTop: '1px solid #fff',
                         paddingTop: '5px', // Increased padding
                         marginTop: '5px', // Increased margin
                       }}
                     >
                       <div className="d-flex justify-content-between align-items-center">
                         <div style={{ width: '40%', textAlign: 'center' }}>
                           <span
                             className="h6"
                             style={{ color: 'white' }}
                           >
                             <b>Today's Count</b>
                           </span>
                           <p
                             style={{
                               color: 'white',
                               fontWeight: 'bold',
                               marginBottom: '0.2rem',
                             }}
                           >
                             {data.today}
                           </p>
                         </div>
                         <div
                           style={{
                             height: '30px',
                             width: '1px',
                             backgroundColor: 'white',
                           }}
                         />
                         <div style={{ width: '40%', textAlign: 'center' }}>
                           <span
                             className="h6"
                             style={{ color: 'white' }}
                           >
                             <b>Month Count</b>
                           </span>
                           <p
                             style={{
                               color: 'white',
                               fontWeight: 'bold',
                               marginBottom: '0.2rem',
                             }}
                           >
                             {data.overall}
                           </p>
                         </div>
                       </div>
                     </div>
                   </CardBody>
                 </Card> */}
                    <div
                      className="branchCardWrapper"
                      style={{
                        transition: "transform 0.3s ease",
                        transform:
                          hoverIndex === index ? "scale(1.05)" : "scale(1)",
                        borderRadius: "15px",
                      }}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <Card
                        style={{
                          width: "290px",
                          height: "220px",
                          borderRadius: "15px",
                          boxShadow:
                            hoverIndex === index ? "0px 0px 5px black" : "none",
                        }}
                      >
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{
                            width: "100%",
                            height: "110px",
                            fontFamily: "Newsreader, serif",
                            fontOpticalSizing: "auto",
                            fontWeight: "700",
                            fontStyle: "normal",
                            fontSize: "26px",
                            letterSpacing: "2px",
                            backgroundColor:"#435769",
                            color: "#FFFFFF",
                          }}
                        >
                          {/* <CardImg
                            className="img-fluid"
                            // src={img1}
                            alt={branch}
                            style={{
                              width: '100%',
                              height: '110px',
                              borderTopLeftRadius: '15px',
                              borderTopRightRadius: '15px',
                              objectFit: 'cover',
                            }}
                          /> */}
                          {branch}
                        </div>
                        {/* Add glare effect here */}
                        <div className="card-glare"></div>
                        <CardBody
                          className="d-flex flex-column align-items-center justify-content-center"
                          style={{
                            backgroundColor: "#D1D9E0",
                            color: "#435769",
                            textAlign: "left",
                            padding: "12px 1rem",
                            borderBottomLeftRadius: "15px",
                            borderBottomRightRadius: "15px",
                          }}
                        >
                          {/* <div
                            style={{
                              backgroundColor: "#2B3A4A",
                              width: "100%",
                              padding: "0.5rem",
                              textAlign: "center",
                            }}
                          >
                            <CardTitle
                              className="h4 m-0"
                              style={{ color: "#FFFFFF", fontWeight: "bold" }}
                            >
                              {branch}
                            </CardTitle>
                          </div> */}
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "1px",
                                fontSize: "14px",
                              }}
                            >
                              <span
                                
                              >
                                <b>Today's Count:</b> {data.today}{" "}
                                {/* Use animated count */}
                              </span>
                              <div style={{ margin: "5px 0" }}></div>
                              <span
                                
                              >
                                <b>Month Count:</b> {data.overall}{" "}
                                {/* Keep overall count as static */}
                              </span>
                            </div>
                            <div
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src="/favicon.ico"
                                alt="Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </Link>
                )
              })}
        </div>
      )}
    </div>
  )
}
export default connect(null, { setBreadcrumbItems })(Analysis)
