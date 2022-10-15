import React, {useState, useEffect, useCallback, useRef } from "react";
import Header from "./component/Header";
import UserModal from "./component/UserModal";
import css from "styled-jsx/css";
import Link from "next/link";
import axios from "axios";
import {
    Accordion,
    Box,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button,
    Checkbox,
    Select,
    Input,
    FormControl,
    FormLabel,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    shouldForwardProp
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

    .SideBar{
        width: 15%;
        height: 100%;
    }

    .SideBar ul{
        padding: 0;
        list-style: none;
        text-align: center;
    }

    .SideBar ul li{
        font-size: 30px;
        width: 90%;
        margin-bottom: 15px;
        border-bottom: solid 2px gray;
        font-weight: bold;
    }

    .SideBar ul li:hover{
        color: blue;
    }
    
    .Main{
        width: 85%;
        border-left: solid 5px gray;
        height: 100%;
    }

    .MainHeader{
        display: flex;
        align-items: center;
        border-bottom: solid 2px gray;
    }

    .MainHeaderTitle{
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
        width: 14.2%;
    }

    table tr td{
        width: 15.33%;
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

function visitorManagement(){

     useEffect(() => {
        getInfo();
      }, [])

    
    const header = ["구분", "성명", "전화번호", "직장명", "직책", "방문일시", "상세정보"]


    const [Data, setData] = useState([]);
    const [DataClone, setDataClone] = useState([]);

    const [doorInfoData, setDoorInfoData] = useState([]);
    const [doorInfoDataClone, setDoorInfoDataClone] = useState([]);
    const [userName, setUserName] = useState("");
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [userLoginId, setUserLoginId] = useState("");
    const [userLoginPw, setUserLoginPw] = useState("");
    const [guestName, setGuestName] = useState("");
    const [staDoorData, setStaDoorData] = useState([]);

    const handleUserName = (e) => setUserName(e.target.value);
    const handleCompany = (e) => setCompany(e.target.value);
    const handlePosition = (e) => setPosition(e.target.value);
    const handleUserLoginId = (e) => setUserLoginId(e.target.value);
    const handleUserLoginPw = (e) => setUserLoginPw(e.target.value);
    const handleGuestName = (e) => setGuestName(e.target.value);

    const SearchName = () => {
        if(guestName !== ""){
            const search = DataClone.filter(e => e.userName === guestName);
            setData(search);
        }else{
            setData(DataClone);
        }
    }

    const addInfo = () => {

        const info = {
            "userName": userName,
            "company": company,
            "position": position,
            "phoneNum": num,
            "userLoginId" : userLoginId,
            "userLoginPw": userLoginPw,
            "doorList": checkedList
        }
        if(serverinfo.company !== "" && serverinfo.position !== "" && serverinfo.adminName
        && serverinfo.num !== "" && serverinfo.adminLoginId !== "" && serverinfo.adminLoginPw !== ""){
            postInfo(info);
            onClose();
        }else{
            alert("빈 칸을 작성해주세요");            
        }
        onClose();

    }

    const handleDoorList = (e) => {
        const selectId = e.target.value;
        if(selectId !== ""){
            const result = doorInfoDataClone.filter(e => selectId === e.staId);
            setDoorInfoData(result);
        }
    }


    const [checkedList, setCheckedLists] = useState([]);
    const onCheckedElement = useCallback(
        (checked, list) => {
         if (checked) {
            setCheckedLists([...checkedList, list.doorId]);
          } else {
            setCheckedLists(checkedList.filter((el) => el !== list.doorId));
          }
        },
        [checkedList]
      );

    const [num, setNum] = useState('');
    const phoneRef = useRef();
    const handlePhone = (e) => {
        const value = phoneRef.current.value.replace(/\D+/g, "");
        const numberLength = 11;
        let result;
        result = "";  
        for (let i = 0; i < value.length && i < numberLength; i++) {
          switch (i) {
            case 3:
              result += "-";
              break;
            case 7:
              result += "-";
              break;
    
            default:
              break;
          }
          result += value[i];
        }
        phoneRef.current.value = result;
        setNum(e.target.value); 
      };

    const getInfo = async () =>{
        const URL = 'http://localhost:5000/user/enterant';
        axios.defaults.withCredentials = true;
        axios.get(URL)
        .then(res => {
            console.log(res);
            if(res.status === 200){
                setData(res.data);
                setDataClone(res.data);            
            }else{
                alert(res.data);
            }
     });
    }

    const getStaDoorInfo = async () =>{
        const URL = 'http://localhost:5000/statement';
        axios.defaults.withCredentials = true;
        axios.post(URL)
        .then(res => {
            console.log(res);
            if(res.status === 200){
                console.log("데이터를 불러오는데 성공했습니다");
                setDoorInfoData([]);
                setStaDoorData(res.data.staData);
                setDoorInfoDataClone(res.data.doorData);           
            }else{
                console.log("데이터를 불러오지 못했습니다");
            }
     });
     onOpen();
    }

    const postInfo = async (item) =>{
        const URL = "http://localhost:5000/user/enterant"
        axios.defaults.withCredentials = true;
            await axios.post(URL, item)
            .then(res => {
                if(res.status === 201){
                    console.log(1);
                    console.log("======================", "데이터 전송 성공");
                }else{
                    console.log("false");
                }
            });
    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    let modal = null;
    modal = <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size = {"6xl"}
      >
        <ModalOverlay />
        <ModalContent style = {{height: "80%"}}>
          <ModalCloseButton />
          <ModalBody pb={6} style = {{width: "80%", margin: "auto", marginTop: "8%"}}>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                    <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                    <div style={{display: "flex"}}>
                        <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦성명</FormLabel>
                        <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleUserName} required/>
                    </div>
                    </FormControl>
                    <FormControl mt={4} style={{width: '40%'}}>
                    <div style={{display: "flex"}}>
                        <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦전화번호</FormLabel>
                        <Input 
                                name="user-num"
                                style = {{borderWidth: "2px", borderColor: "black"}} 
                                value={num} 
                                ref={phoneRef}
                                onChange={handlePhone}
                                type="tel"
                                required
                                />
                    </div>
                    </FormControl>
                </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦직장명</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleCompany} required/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦직책</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handlePosition} required/>
                </div>
                </FormControl>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginBottom: "3%"}}>
                <FormControl mt={4} style={{width: '40%', marginRight: "5%"}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦ID</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleUserLoginId} required/>
                </div>
                </FormControl>
                <FormControl mt={4} style={{width: '40%'}}>
                <div style={{display: "flex"}}>
                    <FormLabel style={{width: "50%", marginTop: "2%", fontSize: "20px", fontWeight: "bold"}}>🟦PW</FormLabel>
                    <Input style = {{borderWidth: "2px", borderColor: "black"}} onChange = {handleUserLoginPw} required/>
                </div>
                </FormControl>
            </div>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦건물명</FormLabel>
              <Select placeholder='-------- 선택하세요 --------' width="100%" onChange = {(e) => {handleDoorList(e)}} style = {{textAlign:"center"
            , marginBottom: "3%"}}>
                                    {staDoorData.map((item) => (
                                        <option value={item.staId} key={item.staId}>
                                        {item.staName}
                                        </option>
                                    ))}
                                </Select>
            </FormControl>
            <FormControl mt={4} style = {{width: '85%', margin: "auto"}}>
              <FormLabel style = {{fontSize: "20px", fontWeight: "bold"}}>🟦출입문명</FormLabel>
                                    {doorInfoData.map((item) => (
                                        <Checkbox value={item.staId} key={item.doorId} style = {{width: "20%", marginBottom: "1%"}}
                                        onChange={(e) => onCheckedElement(e.target.checked, item.doorId)}>
                                        {item.doorName}
                                        </Checkbox>
                                    ))}
            </FormControl>
          </ModalBody>

          <ModalFooter style = {{margin: "auto"}}>
            <Button colorScheme='blue' mr={3} onClick = {addInfo}>
              저장
            </Button>
            <Button onClick={onClose} colorScheme='blue'>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    console.log(Data);
    return(
        <div>
            <Header/>
            <div className="container">
                <div className="containerBody">
                    <div className = "SideBar">
                        <ul>
                            <li><Link href = "./main">출입문 현황</Link></li>
                            <li ><Link href = "./ManagementSettings">출입문 관리설정</Link></li>
                            <li><Link href = "./ExitHistory">출입문 입출이력</Link></li>
                            <li className = "Select"><Link href = "#">출입자 관리</Link></li>
                            <li><Link href = "./visitorManager">출입 관리자</Link></li>
                            <li><Link href = "./alarmHistory">경보 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle" style = {{width: "25%",  marginRight: "1%"}}>🟦 출입자 관리</h1>
                            <Input placeholder= "Search Guest Name" style = {{width: "25%"}} onChange = {handleGuestName}/>
                            <Button style = {{marginLeft: "1%"}} onClick = {SearchName}>검색</Button>
                            <div className = "MainHeaderBtn" style = {{width: "70%"}}>
                                <Button onClick={getStaDoorInfo} colorScheme='green' style = {{float: "right"}}>➕</Button>
                                {modal}
                            </div>
                        </div>
                        <div className = "TableThead">
                            <table>
                                <thead>
                                    <tr>{header.map((item)=>{
                                        return <th>{item}</th>
                                    })}</tr>
                                </thead>
                            </table>
                        </div>
                        <div className = "tableTbody">
                            <table>
                                <tbody>
                                {Data.map((item)=>{
                                    let Flag = "";
                                    if(item.userFlag === 0){
                                        Flag = "상시";
                                    } else if(item.userFlag === 1){
                                        Flag = "방문";
                                    } else{
                                        Flag = "자주";
                                    }
                                    let DoorInfo = item.doorInfo; 
                                            return(
                                                <tr>
                                                    <Accordion allowToggle>
                                                    <AccordionItem>
                                                    <td>{Flag}</td>
                                                    <td>{item.userName}</td>
                                                    <td>{item.phoneNum}</td>
                                                    <td>{item.company}</td>
                                                    <td>{item.position}</td>
                                                    <td>방문일시</td>
                                                    <td>
                                                        <AccordionButton style = {{marginLeft: "52%"}}>
                                                            <Box flex='1' textAlign='center'>
                                                            상세 정보
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton></td>
                                                        <AccordionPanel pb={4}>
                                                            {DoorInfo.map((e) => {
                                                                return(
                                                                <tr>
                                                                    <td>건물명 : {e.staName}</td>
                                                                    <td>도어명 : {e.doorNameList.toString()}</td> 
                                                                </tr>
                                                                )
                                                            })}
                                                         </AccordionPanel>
                                                        </AccordionItem>
                                                        </Accordion>
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

export default visitorManagement;