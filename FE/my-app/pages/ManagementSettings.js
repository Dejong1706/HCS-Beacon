import React, {useState, useEffect} from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import css from "styled-jsx/css";
import {setHours, setMinutes} from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Cookies } from "react-cookie";
import SideBar from "./component/SideBar";

import {
    Button,
    Checkbox,
    Input,
    FormControl,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Select,
    Stack,
    Radio, 
    RadioGroup
  } from '@chakra-ui/react'

const style = css`
    .container{
        width: 95%;
        height: 80vh;
        margin: auto;
        margin-top: 40px;
        border-top: solid 5px gray;
    }
    
    .containerBody{
        display: flex;
        height: 100%;
    }
    
    .Main{
        width: 85%;
        border-left: solid 5px gray;
        height: 100%;
    }
    .MainHeader{
        height: 15%;
        margin-top: 1%;
        display: flex;
        justify-content: space-between;
    }
    .MainHeaderTitle{
        width: 95%;
        font-size: 40px;
        font-weight: bold;
    }
    .siren{
        margin: 0;
        font-size: 80px;
    }
    .MainHeaderTitle{
        margin-left: 30px;
    }
    .Select{
        color: blue;
    }
    .ModalBody{
        width: 500px;
    }
    .a{
        width: 50%;
    }
    .DateSelect{
        display: flex;
        flex-direction: column;
    }
    table{
        width: 100%;
        font-weight: bold;
        font-size: 20px;
        width: 100%;
        margin: 0;
        text-align: center;
    }
    table tr th{
        font-size: 25px;
        width: 12.5%;
    }
    table tr td{
        width: 12.5%;
    }
    .TableThead{
        border-bottom: solid 2px gray;
        margin-bottom: 1%;
    }
    .TableTbody{
        height: 65%;
        overflow: auto;
        text-align: center;
    }
    .TableTbody table tr{
        height: 50px;
    }
`;


const cookies = new Cookies();

function ManagementSettings(){

    useEffect(() => {
        getDoorInfo();
        getStaInfo();
        getCookieFunc();
      }, [])

    const [isSuper, setIsSuper] = useState(false);

    const getCookieFunc = () => {
        if(cookies.get("isSuper") === "1"){
            setIsSuper(true);
        }else{
            setIsSuper(false);
        }
      }


    const header = ["건물명", "출입문명", "ID(비콘)", "현재상태", "출입관리", "날짜", "개방시간", "폐쇄시간"]

    const [Data, setData] = useState([]);
    const [addData, setAddData] = useState([]);
    const [AdminId, setAdminId] = useState("");
    const [doorName, setDoorName] = useState("");
    const [doorId, setDoorId] = useState("");
    const [staName, setstaName] = useState("");
    const [staId, setstaId] = useState("");
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [weekCheck, setweekCheck] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [staDoorData, setStaDoorData] = useState([]);

    const onSelect = (time) => {
        setStartTime(time);
        setIsSelected(true);
        setEndTime(null);
    };

    const force = () => {
        window.location.reload();
    }

    const onSelectEnd = (time) => {
        setEndTime(time);
    }

    const handleAdminId = (e) => setAdminId(e.target.value);
    const handledoorname = (e) => setDoorName(e.target.value);
    const handledoorId = (e) => setDoorId(e.target.value);
    const handlestaName = (e) => {
        const Name = e.target.value;
        setstaName(Name);
        staDoorData.map((e) => Name === e.staName ? setstaId(e.staId) : null);
    }
    const handlestaId = (e) => setstaId(e.target.value);
    const handleisMonitoring = (e) => setIsMonitoring(e.target.value);  
    const handleCheckdList = (checked, item) => {
        if (checked) {
          setCheckedList([...checkedList, item]);
        } else if (!checked) {
          setCheckedList(checkedList.filter(el => el !== item));
        }
      };  

    const addInfo = () => {

        const isMonitoringBoolean = Boolean(Number(isMonitoring));
        const OpenTime = "";
        const CloseTime = "";
        if(startTime !== null){
            OpenTime = String(startTime.getHours()).padStart(2, "0") + ":" + String(startTime.getMinutes()).padStart(2, "0") + ":" + "00";
        }
        if(endTime !== null){
            CloseTime = String(endTime.getHours()).padStart(2, "0") + ":" + String(endTime.getMinutes()).padStart(2, "0") + ":" + "00";
        }


        const serverinfo = {
            "adminLoginId" : AdminId,
            "staName": staName,
            "staId" : staId,
            "doorName": doorName,
            "doorId": doorId,
            "isMonitoring": isMonitoringBoolean,
            "openWeeks": checkedList,
            "openDates": String(startDate),
            "openTime": OpenTime,
            "closeTime": CloseTime
        }



        if(serverinfo.adminLoginId !== "" && serverinfo.doorId !== "" && serverinfo.doorName !== "" && 
        serverinfo.openTime  !== "" && serverinfo.closeTime !== "" && checkedList.length !== 0){
            postDoorInfo(serverinfo);
            clearData();
            onClose();
        }else{
            alert("빈 칸을 작성해주세요");      
        }
    }

    const clearData = () => {
        setIsMonitoring("");
        setIsSelected(false);
        setCheckedList([]);
        setStartDate(new Date());
        setStartTime(null);
        setEndTime(null);
    }

    const getDoorInfo = async () =>{
        const URL = 'http://localhost:8080/door/management';
        axios.defaults.withCredentials = true;
        await axios.get(URL)
        .then(res => {
            if(res.status === 200){
                setData(res.data);           
            }else{
                alert(res.data);
            }
     });
    }

    const postDoorInfo = async (item) =>{
        const URL = "http://localhost:8080/door/register"
        axios.defaults.withCredentials = true;
            await axios.post(URL, item)
            .then(res => {
                if(res.status === 201){
                }else{
                    alert(res.data);
                }
            });
    }

    const getStaInfo = async () =>{
        const URL = 'http://localhost:8080/statement';
        axios.defaults.withCredentials = true;
        axios.post(URL)
        .then(res => {
            // console.log(res);
            if(res.status === 200){
                setStaDoorData(res.data.staData);          
            }else{
            }
     });
    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [startDate, setStartDate] = useState(new Date());
    let modal = null;
    modal = <Modal
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size = {"6xl"}
      >
        <ModalOverlay />
        <ModalContent style = {{height: "80%"}}>
          <ModalBody pb={6} style = {{width: "80%", margin: "auto", marginTop: "8%"}}>
            <FormControl style={{width: '85%', margin: "auto", marginBottom: "2%"}}>
            <div style={{display: "flex"}}>
                    <FormLabel style={{width: "30%", marginTop: "1%", fontSize: "20px", fontWeight: "bold"}}>🟦담당관리자 ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} ref={initialRef} onChange = {handleAdminId}/>
                </div>
            </FormControl>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                <FormControl mt={4} style={{width: '80%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "20%", marginTop: "1%", fontSize: "20px", fontWeight: "bold"}}>🟦건물명</FormLabel>
                    <Select placeholder='Select Gate'
                                onChange = {(e) => {
                                    handlestaName(e)
                                }}width="70%">
                                    {staDoorData.map((item) => (
                                        <option value={item.staName} key={item.staName}>
                                        {item.staName}
                                        </option>
                                    ))}
                    </Select>
                </div>
                </FormControl>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "3%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦도어명</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handledoorname}/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "40%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦도어ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange= {handledoorId}/>
                </div>
                </FormControl>
            </div>
            <FormControl mt={4} style = {{width: '85%', margin: "auto", marginBottom: "3%"}}>
              <div style={{display: "flex"}}>
                <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦출입감시여부</FormLabel>
                <RadioGroup defaultValue='2'>
                    <Stack spacing={5} direction='row'>
                        <Radio colorScheme='green' value = "1" onChange = {handleisMonitoring}>
                        Y
                        </Radio>
                        <Radio colorScheme='red' value = "0" onChange = {handleisMonitoring}>
                        N
                        </Radio>
                    </Stack>
                    </RadioGroup>
              </div>
            </FormControl>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦개방일시</FormLabel>
                <div className = "OpenDayDiv" style = {{width: "100%" ,height: "150px", flexDirection: "column", justifyContent: "center",
                                                        display: "flex", alignItems: "center",fontWeight: "bold"}}>
                    <ul className=  "DateSelect" style = {{display: "flex", width: "100%",listStyle: "none", 
                                                            alignItems: "center", marginLeft: "10%", marginBottom: "5%"}}>
                        <li style = {{width: "25%"}}>날짜 선택 🗓️</li>
                        <li style = {{border: "solid 3px gray"}}><DatePicker
                                        dateFormat="yyyy-MM-dd"
                                        selected={startDate} 
                                        onChange={date => setStartDate(date)} 
                                        placeholderText="Start Day"/></li>
                    </ul>
                    <ul className=  "DateSelect" style = {{display: "flex", width: "100%",listStyle: "none", alignItems: "center", marginLeft: "10%"
                                                            ,marginBottom: "5%"}}>
                        <li style = {{width: "25%"}}>시간 선택</li>
                        <li style = {{border: "solid 3px gray"}}><div><DatePicker
                                        selected={startTime}
                                        onChange={onSelect}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        minTime={setHours(setMinutes(new Date(), 0), 0)}
                                        maxTime={setHours(setMinutes(new Date(), 30), 23)}
                                        timeCaption="Time"
                                        dateFormat="aa h:mm 시작"
                                        placeholderText="start time"
                                        className="mt-4"
                                    /></div></li>
                            {isSelected ? // 시작 시간을 선택해야 종료 시간 선택 가능
                            <li style = {{border: "solid 3px gray", marginLeft: "5%"}}> 
                                <div><DatePicker
                                selected={endTime}
                                onChange={onSelectEnd}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                minTime={startTime}
                                maxTime={setHours(setMinutes(new Date(), 30), 23)}
                                excludeTimes={[
                                    // 시작 시간 제외
                                    startTime,
                                ]}
                                timeCaption="Time"
                                dateFormat="aa h:mm 종료"
                                placeholderText="end time"
                                className="mt-3"
                            /></div>
                            </li>
                            : null 
                            }
                    </ul>
                    <ul className=  "DateSelect" style = {{display: "flex", width: "100%",listStyle: "none", alignItems: "center", marginLeft: "10%"}}>
                    <li style = {{width: "25%"}}>요일 선택</li>
                        <li style = {{marginRight: "1%"}}><Checkbox value={"월요일"} onChange={e => {
                      handleCheckdList(e.target.checked, e.target.value);}}>월요일</Checkbox></li>
                        <li style = {{marginRight: "1%"}}><Checkbox value={"화요일"} onChange={e => {
                      handleCheckdList(e.target.checked, e.target.value);}}>화요일</Checkbox></li>
                        <li style = {{marginRight: "1%"}}><Checkbox value={"수요일"} onChange={e => {
                      handleCheckdList(e.target.checked, e.target.value);}}>수요일</Checkbox></li>
                        <li style = {{marginRight: "1%"}}><Checkbox value={"목요일"} onChange={e => {
                      handleCheckdList(e.target.checked, e.target.value);}}>목요일</Checkbox></li>
                        <li style = {{marginRight: "1%"}}><Checkbox value={"금요일"} onChange={e => {
                      handleCheckdList(e.target.checked, e.target.value);}}>금요일</Checkbox></li>
                        <li style = {{marginRight: "1%"}}><Checkbox value={"토요일"} onChange={e => {
                      handleCheckdList(e.target.checked, e.target.value);}}>토요일</Checkbox></li>
                        <li><Checkbox value={"일요일"} onChange={e => {
                      handleCheckdList(e.target.checked, e.target.value);}}>일요일</Checkbox></li>
                    </ul>
                </div>
            </FormControl>
          </ModalBody>

          <ModalFooter style = {{margin: "auto"}}>
            <Button colorScheme='blue' mr={3} onClick = {addInfo}>
              저장
            </Button>
            <Button onClick={(e) => {
                onClose(e)
                clearData(e)}} colorScheme='blue'>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    return(
        <div>
            <Header/>
            <div className="container">
                <div className="containerBody">
                    <SideBar pageNumber = "2" isSuper = {isSuper}/>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle">🟦 출입문 관리 설정</h1>
                            <div className = "BtnDiv" style = {{display: "flex"}}>
                                <Button onClick = {force} style = {{marginRight: "10%", backgroundColor: "#ffb300"}}>
                                    <FontAwesomeIcon icon={faArrowRotateBack}/>
                                </Button>
                                <Button onClick={onOpen} colorScheme='green'>➕</Button>
                                {modal}
                            </div>
                        </div>
                        <div className = "TableThead">
                            <table>
                                <thead>
                                <tr>{header.map((item, index)=>{
                                    return <th key = {index}>{item}</th>
                                })}</tr>
                                </thead>
                            </table>
                        </div>
                        <div className = "TableTbody">
                            <table>
                                <tbody>
                                    {Data.map((item, index)=>{
                                        return(
                                            <tr key = {index}>
                                                <td>{item.staName}</td>
                                                <td>{item.doorName}</td>
                                                <td>{item.doorId}</td>
                                                <td style = {{color: "red"}}>{Number(item.isOpen)}</td>
                                                <td style = {{color: "red"}}>{Number(item.isMonitoring)}</td>
                                                <td>{item.latestDate}</td>
                                                <td style = {{color: "red"}}>{item.openTime}</td>
                                                <td style = {{color: "blue"}}>{item.closeTime}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                    <UserModal/>
                </div>
            </div>
            <style jsx>{style}</style>
            
        </div>
    )
}

export default ManagementSettings;