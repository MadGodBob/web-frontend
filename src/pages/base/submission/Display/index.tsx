/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-17 21:54:01
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-03-26 13:49:17
 * @FilePath: \web-frontend-master\src\pages\base\submission\Display\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ActionType, ModalForm, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { Button, Card, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { waitTime } from '@/utils/request';
import { Image } from 'antd';
import { downloadFile, getFileName } from '@/services/api/submission';

interface InputDialogProps {
  detailData?: API.SubmissionDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function Display(props: InputDialogProps) {
  const refAction = useRef<ActionType>(null);
  const form = useRef<ProFormInstance>(null);
  const [file, setFile] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [once, setOnce] = useState(true);

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
    props.onClose(true);
    return true;
  };

  const getFName = async () => {
    var data = {
      taskId : props.detailData?.taskId!,
      studentId : props.detailData?.studentid!,
    }
    if (!data.taskId){return;}
    var name = await getFileName(data);
    setFileName(name!)
  }

  const request = async () => {
    const formData = new FormData();
    formData.append('taskId', `${props.detailData?.taskId}`)
    formData.append('studentId', `${props.detailData?.studentid}`)
    let result = await fetch(`/api/submission/downloadFile`, {
      method: 'POST',
      body: formData,
    }).then(res => res.blob())
      .then(data => {
        let blobUrl = window.URL.createObjectURL(data);
        setFile(blobUrl);
        if (!once){download(blobUrl);}
      });
  }
  getFName();
  if (props.visible && once){request();setOnce(false)}
  if (!props.visible && !once){setOnce(true)}
  if (!props.visible && file){setFile("")}

  function download(blobUrl: string) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = blobUrl;
    a.click();
  }

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={props.detailData?.name + "的提交结果"}
      open={props.visible}
    >
      <Card>
        <div>{props.detailData?.answer}</div>
      </Card>
      <div>图片：</div>
      <Image src={file}></Image>
      <div>　</div>
      <Button type='link' disabled={fileName?false:true} onClick={request} loading={downloading}>{fileName ? ("点击下载提交文件：" + fileName) : "无提交文件"}</Button>
    </ModalForm>
  );
}
