import { ActionType, ModalForm, ProColumns, ProForm, ProFormInstance, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Progress, Radio, Space, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { convertPageData, waitTime } from '@/utils/request';
import { orderBy } from 'lodash';
import { getSubmission, getSubmitted, getUnSubmitted } from '@/services/api/submission';
import Display from '../../submission/Display';

interface check {
  detailData?: API.ClassTaskQueryDTO;
  taskId: string;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function Check(props: check) {
  const form = useRef<ProFormInstance>(null);
  const refAction = useRef<ActionType>(null);
  const [submitted, setSubmitted] = useState(true);
  const [visible, setVisible] = useState(false);
  const [submission, setSubmission] = useState<API.SubmissionDTO>();
  const [sum, setSum] = useState<number>(0);

  const columns: ProColumns<API.StudentsVO>[] = [
    {
      title: '学号',
      dataIndex: 'studentid',
      width: 100,
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
      },
    {
        title: '班级ID',
        dataIndex: 'classId',
        width: 100,
      },
    {
        title: '班级名称',
        dataIndex: 'className',
        width: 100,
    },
    {
        title: '操作',
        width: 50,
        fixed: 'right',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => [
        <Button type="link" disabled={!submitted} onClick={() => {record.taskId=props.taskId;setSubmission(record);setVisible(true);}}>查看</Button>,
      ],
    },
]

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

  const taskId = props.detailData?.taskId;
  const classId = props.detailData?.classId;

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title="完成情况"
      open={props.visible}
    >
      <Radio.Group defaultValue={submitted?"submitted":"unsubmitted"}>
        <Radio.Button value="submitted" onClick={() => {setSubmitted(true);refAction.current?.reload();}}>已完成</Radio.Button>
        <Radio.Button value="unsubmitted" onClick={() => {setSubmitted(false);refAction.current?.reload();}}>未完成</Radio.Button>
      </Radio.Group>
      <Progress percent={sum}/>
      <ProTable<API.StudentsVO>
            actionRef={refAction}
            search={false}
            request={async (params = {}, sort) => {
                const props = {
                  ...params,
                  classId: classId,
                  taskId: taskId,
                  orderBy: orderBy(sort),
                };
                props.keyword
                var a = convertPageData(await getSubmitted(props)).total;
                var b = convertPageData(await getUnSubmitted(props)).total;
                setSum(Number((a/b*100).toFixed(3)));
                if(submitted){
                  return convertPageData(await getSubmitted(props));
                }
                else{
                  return convertPageData(await getUnSubmitted(props));
                }
            }}
            columns={columns}
        />

        <Display
        detailData={submission}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />
        
    </ModalForm>
  );
}
