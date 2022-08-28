import React from "react";
import Header from "./component/Header";
import css from "styled-jsx/css";
import Link from "next/link";
import {
    Checkbox,
    Select,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
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
        justify-content: space-between;
        border-top: solid 4px gray;
        border-bottom: solid 4px gray;
    }

    .MainHeaderTitle{
        font-size: 40px;
        font-weight: bold;
    }

    .icon{
        margin: 0;
        font-size: 50px;
        color: green;
    }

    .MainHeaderTitle{
        margin-left: 30px;
    }

    .Table{
        font-weight: bold;
        font-size: 20px;
    }

    .TableHeader{
        font-size: 20px;
    }
    .Select{
        color: blue;
    }

    .MenuBar{
        height: 8%;
    }

    .MenuBarUl{
        list-style: none;
        height: 100%;
        display: flex;
        margin-left: 30px;
        align-items: flex-end;
    }
    .MenuBarUl li{
        width: 12%;
        border-right: solid 2px #f5f5f5;
        border-left: solid 2px #f5f5f5;
        border-top: solid 2px #f5f5f5;
        background-color: #bdbdbd;
        padding: 8px 18px;
        font-weight: bold;
        border-top-right-radius: 30px;
    }
    .MenuBarUl li:hover{
        background-color: #448aff;
    }

    .daySelect{
        border-bottom: solid 4px gray;
        display: flex;
        flex-direction: row;
        height: 10%;
        font-weight: bold;
    }

    .daySelect .timeSelect{
        margin-left: 40px;
        align-items: center;
        width: 100%;
        display: flex;
    }

    .daySelect .timeSelect p:first-child{
        margin-right: 1%;
    }

    .daySelect .timeSelect p:not(:first-child){
        margin-left: 1%;
        margin-right: 1%;
    }

`;

function emergencyDoorOpen(){
    return(
        <div>
            <Header/>
            <div className="container">
                <div className="containerBody">
                    <div className = "SideBar">
                        <ul>
                            <li><Link href = "./main">출입문 현황</Link></li>
                            <li><Link href = "./ManagementSettings">출입문 관리설정</Link></li>
                            <li className = "Select"><Link href = "#">출입문 입출이력</Link></li>
                            <li><Link href = "./visitorManagement">출입자 관리</Link></li>
                            <li><Link href = "#">출입 관리자</Link></li>
                            <li><Link href = "#">경보 이력</Link></li>
                            <li><Link href = "#">문자발생 이력</Link></li>
                        </ul>
                    </div>
                    <div className = "Main">
                        <div className = "MenuBar">
                            <ul className = "MenuBarUl">
                                <li><Link href = "./ExitHistory">출입문 입출이력</Link></li>
                                <li><Link href = "./reservationCheck">방문자 예약승인</Link></li>
                                <li style= {{backgroundColor: "#448aff"}}>비상도어 개방</li>
                            </ul>
                        </div>
                        <div className = "MainHeader">
                            <h1 className = "MainHeaderTitle">🟦 비상도어 개방</h1>
                        </div>
                        <div className = "daySelect">
                            <div className = "timeSelect">
                                <p>▶ 전체도어 개방</p>
                                <Checkbox></Checkbox>
                                <p>▶ 조회 시간 선택</p>
                                <Select placeholder='Select Gate' width="20%">
                                    <option value='option1'>Option 1</option>
                                    <option value='option2'>Option 2</option>
                                    <option value='option3'>Option 3</option>
                                </Select>
                                <Checkbox style = {{marginLeft: "1%"}}></Checkbox>
                            </div>
                        </div>
                    <div className = "Table">
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                <Tr>
                                    <Th>건물명</Th>
                                    <Th>출입문 명</Th>
                                    <Th>ID(비콘)</Th>
                                    <Th>현재상태</Th>
                                    <Th>개방시간</Th>
                                    <Th>폐쇄시간</Th>
                                    <Th isNumeric>경보상태</Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                <Tr>
                                    <Td>본관</Td>
                                    <Td>전기실</Td>
                                    <Td>A01010101</Td>
                                    <Td>0</Td>
                                    <Td>08:00:00</Td>
                                    <Td>08:00:00</Td>
                                    <Td isNumeric>0</Td>
                                </Tr>
                                <Tr>
                                <Td>본관</Td>
                                    <Td>통신실</Td>
                                    <Td>A02020202</Td>
                                    <Td>0</Td>
                                    <Td>08:00:00</Td>
                                    <Td>08:00:00</Td>
                                    <Td isNumeric>0</Td>
                                </Tr>
                                </Tbody>
                                <Tfoot>
                                <Tr>
                                <Td>본관</Td>
                                    <Td>기계실</Td>
                                    <Td>A03030303</Td>
                                    <Td>0</Td>
                                    <Td>08:00:00</Td>
                                    <Td>08:00:00</Td>
                                    <Td isNumeric>0</Td>
                                </Tr>
                                </Tfoot>
                            </Table>
                        </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{style}</style>
        </div>
    )
}

export default emergencyDoorOpen;