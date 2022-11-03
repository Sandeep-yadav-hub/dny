import React, { useEffect, useState } from 'react';

import { Button, Grid, IconButton, ListItemButton } from '@mui/material';
import TableComponent from '../table/table.component';
import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { createBranch, getBranchList } from '../../actions/hr';

function createHead(key,numeric){
    const result = key.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return {
        id: key,
        numeric: numeric,
        disablePadding: false,
        label: finalResult,
    } 
}


const Payslip = ({setTabOpend}) => {

    let dispatch = useDispatch()
    const [denseTable,setDenseTable] = useState(true)
    const [headCells,setHeadCells] = useState([])
    const [payslipCells,setPayslipCells] = useState([])
    const [newPayslipTemplate,setNewPayslipTemplate] = useState("")
    const [openAddPayslipTemplate,setOpenAddPayslipTemplate] = useState(false)
    const payslipTemplate = useSelector(state=>state.payslip.template)

    const onClickOnRow = (event,id)=>{
        console.log(id)
        const row = payslipCells.find(item=>item.id==id)
        console.log(row)
    }

    const handleClickOnAddPayslipTemplate = ()=>{
        setNewPayslipTemplate("")
        setOpenAddPayslipTemplate(true);
    }

    useEffect(()=>{
        setTabOpend("Payslip Template")
        var head = []
        head.push(createHead("id",true))
        head.push(createHead("name",false))
        setHeadCells(head)

        if(payslipTemplate?.length==0){
            console.log("dispatch getPayslipTemplateList")
            // dispatch(getBranchList())
        }
    },[])


    useEffect(() => {
        if(payslipTemplate){
            setPayslipCells(payslipTemplate)
        }
    }, [payslipTemplate]);

    return (
        <>
            <Button onClick={handleClickOnAddPayslipTemplate} variant={"outlined"} style={{color:"#333",border:"1px solid #333",marginBottom:"10px"}}>Create <AddIcon /></Button>
            <>
            
            </>
            <TableComponent 
                rows={payslipCells} 
                headCells={headCells} 
                denseTable={denseTable} 
                // onClickOnDelete={(selected,selectedIdx)=>{
                //     console.log(selected,selectedIdx)
                // }} 
                onClickOnRow={onClickOnRow}
            />
        </>
    );
}

export default Payslip
