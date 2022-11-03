import styled from 'styled-components';

export const OrganisationCard = styled.div`
    width: fit-content;
    margin: auto;
    border:1px solid #999;
    border-radius:5px;
    padding:10px 12px;
    font-size:16px;
    > .profile{
        display:flex;
        align-items:center;
        width:200px;
        // justify-content:center;
        > .MuiAvatar-root{
            margin:0;
            width:40px;
            height:40px;
            font-size:12px;
        }
        > .profileInfo{
            > .name{
                font-size:14px;
            }
            > .designation{
                font-size:12px;
                color:#999;
            }
            >p{
                text-align:left;
                margin-top:0px;
                margin-bottom:0px;
                margin-left:10px;
            }
        }
    }
    > .information {
        padding:10px 15px;
        text-align:left;
        display:none;
        width:250px;
        position:absolute;
        background:#fff;
        border-radius:4px;
        border:1px solid #999;
        z-index:11;
        font-size:12px;
        > p{
            margin-bottom:0;
        }
        > .MuiAvatar-root{
            width:80px;
            height:80px;
            margin-bottom:10px;
        }
    }
    &:hover {
        > .information {
            display:initial;
        }
    }
`