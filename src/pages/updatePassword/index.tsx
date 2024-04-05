/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-20 09:28:34
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-03-20 18:58:21
 * @FilePath: \web-frontend-master\src\pages\updatePassword\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { updatePassword } from "@/services/api/admin";
import { UserOutlined } from "@ant-design/icons"
import { ModalForm, PageContainer } from "@ant-design/pro-components"
import { useModel } from "@umijs/max";
import { Avatar, Button, Input, Modal, Space, message } from "antd"
import { useState } from "react";

export default () => {
        const { initialState, setInitialState } = useModel('@@initialState');
        const [oldp, setOldp] = useState<string>("");
        const [newp, setNewp] = useState<string>("");

        const getOldp = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setOldp(e.target.value);
        }
        const getNewp = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setNewp(e.target.value);
        }

        const finish = async (oldPassword:string, newPassword:string) => {
                if(!oldp){message.warning("旧密码不能为空");return;}
                if(!newp){message.warning("新密码不能为空");return;}
                const dto:API.PasswordDTO ={
                        oldPassword : oldPassword,
                        newPassword : newPassword,
                }
                try {await updatePassword(dto, { throwError: true });}
                catch (ex){
                        return;
                }
                Modal.success({
                        content: '修改成功',
                      });
        }

        return(
                <PageContainer>
                        <div>　</div>
                        <Space wrap size={16}>
                                <Avatar size={80} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} />
                                <Button size="large" >{initialState?.currentToken?.userName}</Button>
                                <Button size="large" >{initialState?.currentToken?.userCode}</Button>
                        </Space>
                        <div>　</div>
                        <div>　</div>
                        <Space>
                                <Input size="middle" onClick={() => {}} onChange={getOldp} placeholder="输入旧密码" prefix={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} />
                                <div>　</div>
                        </Space>
                        <div>　</div>
                        <Space>
                                <Input size="middle" onClick={() => {}} onChange={getNewp} placeholder="输入新密码" prefix={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} />
                                <div>　</div>
                        </Space>
                        <div>　</div>
                        <Space>
                                <div>　　　　　　　　　　　　　</div>
                                <Button type="primary" onClick={() => {finish(oldp, newp);}}>
                                        确定
                                </Button>
                        </Space>
                        </PageContainer>
        )
}