import { ActionType, ModalForm, ProForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { waitTime } from '@/utils/request';
import { addTask, updateTask } from '@/services/api/classTask';
import { listClassId, listClassName } from '@/services/api/classes';

interface InputDialogProps {
  detailData?: API.ClassTaskDTO;
  sub: boolean;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export const ids = await listClassId();
export const names = await listClassName();

export default function InputDialog(props: InputDialogProps) {
  const refAction = useRef<ActionType>(null);
  const form = useRef<ProFormInstance>(null);
  const [classId, setClassId] = useState<string>("");
  const [auto, setAuto] = useState(false);
  const [randomTaskId, setRandomTaskId] = useState<string>("");

  const random = (classID:string|undefined) => {
    const randomNum = Math.floor(Math.random() * 100);
    var numString:string = randomNum.toString();
    if (numString.length == 1){numString="0"+numString}
    setRandomTaskId(classID+numString);
  }

  interface option {
    value: string;
    label: string;
  }
  const classIdList:option[] = Array();
  const classNameList:option[] = Array();
  ids?.forEach(function (id) {
    const classId:option = { value: id, label: id }
    classIdList.push(classId)
  });
  names?.forEach(function (name) {
    const className:option = { value: name, label: name }
    classNameList.push(className)
  });

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form?.current?.setFieldsValue(props.detailData);
      } else {
        form?.current?.resetFields();
      }
    });
  }, [props.detailData, props.visible]);

  const onFinish = async (values: any) => {
    const { id, taskId, classId, className, taskDescription } = values;
    var data: API.ClassTaskDTO = {
      id : props.detailData?.id,
      taskId,
      classId,
      className,
      taskDescription,
    };
    if (randomTaskId){data.taskId=randomTaskId}

    try {
      if (!props.sub && props.detailData) {
        await updateTask(data, { throwError: true });
      } else {
        await addTask(data, { throwError: true });
      }
    } catch (ex) {
      return true;
    }

    props.onClose(true);
    message.success('保存成功');
    setClassId("");
    setAuto(false);
    return true;
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={(!props.sub && props.detailData) ? "修改任务" : "发布任务"}
      open={props.visible}
    >
      <div> ● 任务ID</div>
      <ProForm.Group>
      <div>
      {!auto && <ProFormText
          name="taskId"
          width={120}
          disabled={props.detailData?.taskId != null}
          rules={[
            {
              required: true,
              message: '请输入任务ID！',
            },
          ]}
        />}
      {auto && <Button size="middle">{randomTaskId+"　　　"}</Button>}
      </div>
      <div>
        {!(!props.sub && props.detailData) && <Button type="primary" disabled={(classId||props.detailData?.classId)?false:true} shape="round" onClick={() => {random(classId?classId:props.detailData?.classId);setAuto(true);refAction.current?.reload();}}>自动分配</Button>}
        {auto && <Button type="primary" danger shape="round" onClick={() => {setRandomTaskId("");setAuto(false);refAction.current?.reload();}}>取消</Button>}
        {auto && <div>　</div>}
      </div>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
            width="sm"
            options={classIdList}
            onChange={setClassId}
            name="classId"
            label="班级ID"
            rules={[{ required: true, message: '请输入班级ID!' }]}
            placeholder='请选择班级ID'
        />
        <ProFormSelect
            width="sm"
            options={classNameList}
            name="className"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称!' }]}
            placeholder='请选择班级名称'
        />
      </ProForm.Group>
      <ProFormText 
          name="taskDescription" 
          label="任务描述" 
          rules={[
            {
              required: true,
              message: '请输入任务描述！',
            },
          ]}/>
      <div>
        ●若未及时显示选项，请刷新页面
      </div>
    </ModalForm>
    
  );
}
