import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { useDispatch, useSelector } from 'react-redux';
import { getDesignationList, getEmployeesList } from '../../actions/hr';
import Button from '@mui/material/Button';
import { OrganisationCard } from './styledComonents';
import Avatar from '@mui/material/Avatar';

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

function stringAvatar(name,src,alt) {
    if (name){
        var nameChildren = name.split(" ")
        return {
          sx: {
            bgcolor: stringToColor(name),
            width: 100, height: 100,margin:"auto"
          },
          alt:alt,
          src:src,
          children: `${name.split(' ')[0][0]} ${nameChildren.length>1? name.split(' ')[1][0]:""}`,
        };
    }
  }



const treeNodeElm = (idx,item,child)=>{
    if(item.firstName=="Sandeep"){
        console.log(item)
    }
    if(child){
        return (
            <TreeNode key={item.firstName+idx} 
                label={
                    <OrganisationCard>
                        
                        <div className="profile">
                            <Avatar 
                                {...stringAvatar(`${item.firstName} ${item.lastName}`,"",item.firstName)}
                            />
                            <div className="profileInfo">
                                <p className="name">{item.firstName}</p> 
                                <p className="designation">{item.designation?.name}</p>
                            </div>

                        </div>
                        <div className='information'>
                            <Avatar 
                                {...stringAvatar(`${item.firstName} ${item.lastName}`,"",item.firstName)}
                            />
                            <p>ID: #{item.id}</p>
                            <p>Branch: {item.branch?.name}</p>
                            <p>Designation: {item.designation?.name}</p>
                            <p>Email: {item.user.email}</p>
                            {item.employeesinfos.length>0 && (
                                <>
                                    {item.employeesinfos.map((item2,idx2)=>{
                                        console.log(item2)
                                        return(
                                            <p>{item2.key} : {item2.value}</p>
                                        )
                                    })}
                                </>
                            )}
                            <p>Secondary report: {item.secondryReportsTo?.user?.username}</p>
                        </div>
                    </OrganisationCard>
                } 
            >
                {child}
            </TreeNode>
        )
    }else{
        return (
            <TreeNode key={item.firstName+idx} 
                label={
                    <OrganisationCard>
                        
                        <div className="profile">
                            <Avatar 
                                {...stringAvatar(`${item.firstName} ${item.lastName}`,"",item.firstName)}
                            />
                            <div className="profileInfo">
                                <p className="name">{item.firstName}</p> 
                                <p className="designation">{item.designation?.name}</p>
                            </div>
                        </div>
                        <div className='information'>
                            <Avatar 
                                {...stringAvatar(`${item.firstName} ${item.lastName}`,"",item.firstName)}
                            />
                            <p>ID: #{item.id}</p>
                            <p>Branch: {item.branch?.name}</p>
                            <p>Designation: {item.designation?.name}</p>
                            <p>Email: {item.user.email}</p>
                            {item.employeesinfos.length>0 && (
                                <>
                                    {item.employeesinfos.map((item2,idx2)=>{
                                        console.log(item2)
                                        return(
                                            <p>{JSON.stringify(item2)}</p>
                                        )
                                    })}
                                </>
                            )}
                            <p>Secondary report: {item.secondryReportsTo?.user?.username}</p>
                        </div>
                    </OrganisationCard>
                } 
            />
        )
    }
}


function useStateCallback(initialState) {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null);
  
    const setStateCallback = useCallback((state, cb) => {
        cbRef.current = cb; 
        setState(state);
    }, []);
  
    useEffect(() => {
      if (cbRef.current) {
        console.log(state,cbRef.current)
        cbRef.current(state);
        cbRef.current = null;
      }
    }, [state]);
  
    return [state, setStateCallback];
  }

const OrganisationChart = ({setTabOpend}) => {
    let dispatch = useDispatch()
    const employeeList = useSelector(state=>state.hr.employees)
    const [desigantionListTried,setDesignationListTried] = useState(false)
    const [chart,setChart] = useStateCallback(<Tree lineWidth={'1px'} lineColor={'#999'} lineBorderRadius={'5px'} label={<div></div>}></Tree>)
    const cbRef = useRef(null)
    useEffect(()=>{
        setTabOpend("Organisation")
    },[])

    useEffect(()=>{
        if(employeeList?.length==0){
            if(!desigantionListTried){
                setDesignationListTried(true)
                // dispatch(getDesignationList())
                dispatch(getEmployeesList({limit:0,offset:0}))
            }
        }
    },[])


    async function renders(childs){
        var c = []
        if(!childs){
            return
        }
        childs.forEach(async(item,idx)=>{
            if(item.child){
                var child = await renders(item.child)
                c.push(treeNodeElm(idx,item,child))
            }else{
                c.push(treeNodeElm(idx,item,null))
            }
        })
        return c
    }

    const changeReportType = async(employee,type)=>{
        if(employee?.length>0){
            var data = await childRender(employee,type)
            var s = <Tree
                    lineWidth={'1px'}
                    lineColor={'#999'}
                    lineBorderRadius={'5px'}
                    label={
                        <OrganisationCard>
                            <div className="profile">
                                <Avatar 
                                    {...stringAvatar(`${data.firstName} ${data.lastName}`,"",data.firstName)}
                                />
                                <div className="profileInfo">
                                    <p className="name">{data.firstName}</p> 
                                    <p className="designation">{data.designation?.name}</p>
                                </div>
                            </div>
                            <div className='information'>
                                <Avatar 
                                    {...stringAvatar(`${data.firstName} ${data.lastName}`,"",data.firstName)}
                                />
                                <p>ID: #{data.id}</p>
                                <p>Branch: {data.branch?.name}</p>
                                <p>Designation: {data.designation?.name}</p>
                                <p>Email: {data.user.email}</p>
                                <p>Secondary report: {data.secondryReportsTo?.user?.username}</p>
                            </div>
                        </OrganisationCard>
                    }
                >
                    {await renders(data.child)}
                </Tree>
                setChart(s)
        }
    }


    useEffect(()=>{
        if(employeeList?.length>0){
            // var newList = [...employeeList]
            changeReportType(employeeList,"primaryReportsTo")
        }
    },[employeeList])


    const childRender = async(item,reportType,result={})=>{
        var newArray = []
        var idMapping = item.reduce((acc, el, i) => {
            newArray[i] = {...item[i],child:[]}
            acc[el.id] = i;
            return acc;
        }, {});
        // let root;
        newArray.forEach((el,idx) => {
            // Handle the root element
            if ((el[reportType]==null)) {
                result = el;
                return;
            }
            // Use our mapping to locate the parent element in our data2 array
            var parentEl = newArray[idMapping[el[reportType].id]];
            // Add our current el to its parent's `children` array
            parentEl.child = [...(parentEl.child || []), el];
        });
        return result
    }

    return (
        <div>
            {chart}
        </div>
    );
}

export default OrganisationChart;
