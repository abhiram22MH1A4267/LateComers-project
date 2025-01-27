import React, { useEffect, useState } from "react";
import { setBreadcrumbItems } from "store/actions";
import { connect } from "react-redux";
import {
  Col,
  Row,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap"

import ApexChart from "./newBarChart";
import PieChart from "./newPieChart";
import Chartapex from "./newLineChat";

import axios from "axios";

function Dashboard(props) {
  const breadcrumbItems = [
    { title: "Late Comers", link: "#" },
    { title: "Search", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("Search", breadcrumbItems);
  }, [props]);

  const [selectedOption, setSelectedOption] = useState('ALL');
  const [clgs, setClgs] = useState([]);
  const [numdata, setNUM] = useState([]);
  const [namdata, setNAM] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [pasting, setPasting] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [singlebtn, setSinglebtn] = useState(false)


  const BaseUrl = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const changeStartDate = startDate.split('-').reverse().join('-');
        const changeEndDate = endDate.split('-').reverse().join('-');
        // console.log(changeStartDate , changeEndDate)
        // Fetch college names
        const clgRes = await axios.get(BaseUrl + '/get-clg-names');
        const collegeNamesWithAll = [{ 'collegeName': "ALL" }, ...clgRes.data];

        // Sort by collegeName (case-insensitive)
        collegeNamesWithAll.sort((a, b) => {
          if (a.collegeName === "ALL") return -1;  // Keep "ALL" at the top
          if (b.collegeName === "ALL") return 1;
          return a.collegeName.localeCompare(b.collegeName);  // Sort alphabetically
        });
        setClgs(collegeNamesWithAll);


        // Fetch branchwise data
        const branchwiseRes = await axios.post(BaseUrl + '/get-branchwise', { selectedOption, startDate:changeStartDate, endDate:changeEndDate });
        if (branchwiseRes.data) {
          // console.log(branchwiseRes.data) 
          if (branchwiseRes.data.length === 0) {
            setNAM([0])
            setNUM([0])
            // return;
          }
          else {
            const combinedData = branchwiseRes.data.map(item => ({
              name: item._id,
              totalStudents: item.totalStudents
            }));

            // Sort combinedData based on totalStudents (or name if needed)
            combinedData.sort((a, b) => b.totalStudents - a.totalStudents); // Sort by total students in descending order

            // Extract the sorted names and numbers into separate arrays
            const sortedNUM = combinedData.map(item => item.totalStudents);
            const sortedNAM = combinedData.map(item => item.name);

            // Set the hooks with sorted values
            setNUM(sortedNUM);
            setNAM(sortedNAM);
          }
        }

        // Fetch gender data
        const genderRes = await axios.post(BaseUrl + '/get-gender', { selectedOption, startDate:changeStartDate, endDate:changeEndDate });
        if (genderRes.data.length === 0) {
          setGenderData([{ _id: null, Female: 0, Male: 1 }]);
        }
        else setGenderData(genderRes.data);


        // Fetch past 7 days data
        const pastingRes = await axios.get(BaseUrl + '/get-visitor-seven');
        if (pastingRes.data) {
          setPasting(pastingRes.data);
        } else {
          setPasting([]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (if needed)
      }
    };


    fetchData();
  }, [selectedOption, startDate, endDate, BaseUrl]);

  const dumdata = {
    "Female": 34,
    "Male": 45
  }

  const optionLength = 20;
  const [optionSelected , setOptionSelected] = useState("")

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', fontWeight: '600', fontSize: '35px', paddingBottom: '20px' }}>Late Comers</div>

      {/* Render Dropdowns */}
      {clgs.length > 0 && (
        <Row style={{ marginBottom: '20px' }}>

          <Col lg="6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <label htmlFor="chartSelector" style={{ marginRight: "10px", fontSize: '24px', marginBottom: '0px' }}>
              Select College:
            </label>
            <Dropdown style={{ width: '250px' }} isOpen={singlebtn} toggle={() => setSinglebtn(!singlebtn)}>
              <DropdownToggle className="btn btn-sm w-100" caret>
                {selectedOption} <i className="mdi mdi-chevron-down" />
              </DropdownToggle>
              <DropdownMenu>
  {clgs.map((option, index) => (
    <DropdownItem
      key={index}
      onClick={() => {setSelectedOption(
        option.collegeName.length > 10 
          ? `${option.collegeName.substring(0, 25)}...`
          : option.collegeName
      )
      setOptionSelected(option.collegeName)
    }}
      title={option.collegeName}
    >
      {option.collegeName}  {/* Display full name here */}
    </DropdownItem>
  ))}
</DropdownMenu>

            </Dropdown>
          </Col>



          <Col lg="6">
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <div className="d-flex justify-content-center ">
                <label style={{ fontSize: 16, marginRight: "5px" }}>From: </label>
                <input
                  className="form-control"
                  type="date"
                  value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  id="example-date-input"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="d-flex">
                <label style={{ fontSize: 16, marginRight: "5px" }}>To: </label>
                <input
                  className="form-control"
                  type="date"
                  value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  id="example-date-input"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Delay Rendering Charts until loading is false */}
      {numdata.length > 0 && namdata.length > 0 && (
        <Row>
          <div className="col-lg-8">
            {selectedOption === 'ALL' ? <h1>ALL Colleges</h1> : <h3>{`${optionSelected}`}</h3>}
            <ApexChart numdata={numdata} namdata={namdata} />
          </div>
          {genderData && genderData.length > 0 && (
            <div className="col-lg-4">
              <PieChart Data={genderData} />
            </div>
          )}
        </Row>
      )}

      <br /><br /><br />
      {pasting.length > 0 && (
        <Row>
          <div><Chartapex Data={pasting} /></div>
        </Row>
      )}
      <br />
    </>
  );
}

export default connect(null, { setBreadcrumbItems })(Dashboard);