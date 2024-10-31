import type { InputRef } from 'antd';
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Spin,
  Pagination,
  Modal,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './TabelCrud.css';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  id: string;
  name: string;
  desc: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, [dataIndex]: values[dataIndex] });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  id: React.Key;
  name: string;
  desc: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const App: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visible, setVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);

  useEffect(() => {
    // 从接口请求数据
    axios
      .get('/api/student', {
        params: {
          page: currentPage,
          pageSize: pageSize,
          keyWord: '',
        },
      })
      .then((response) => {
        const data = Array.isArray(response.data.data.data)
          ? response.data.data.data
          : [];
        console.log(data, 'data', response.data.data);

        setDataSource(data);
        setCount(response.data.data.total);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  const handleDelete = async (id: React.Key) => {
    try {
      await axios.delete(`/api/student/${id}`);
      const newData = dataSource.filter((item) => item.id !== id);
      setDataSource(newData);
    } catch (error) {
      console.error('There was an error deleting the data!', error);
    }
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: 'desc',
      dataIndex: 'desc',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record: { id: React.Key }) =>
        dataSource.length >= 1 ? (
          <>
            <a onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
              Edit
            </a>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
            >
              <a>Delete</a>
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    setVisible(true);
  };

  const handleEdit = (record: DataType) => {
    setEditingRecord(record);
    setVisible(true);
  };

  const handleSave = async (values: DataType) => {
    try {
      if (editingRecord) {
        // 编辑记录
        await axios.put(`/api/student/${editingRecord.id}`, values);
        const newData = [...dataSource];
        const index = newData.findIndex((item) => editingRecord.id === item.id);
        newData[index] = { ...editingRecord, ...values };
        setDataSource(newData);
      } else {
        // 添加记录
        const response = await axios.post('/api/student', values);
        setDataSource([...dataSource, response.data]);
        setCount(count + 1);
      }
    } catch (error) {
      console.error('There was an error saving the data!', error);
    }
  };
  const handleCellSave = async (record: DataType) => {
    console.log(record, 'record');

    try {
      await axios.put(`/api/student/${record.id}`, record);
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.id === item.id);
      newData[index] = record;
      setDataSource(newData);
    } catch (error) {
      console.error('There was an error saving the data!', error);
    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleCellSave,
      }),
    };
  });

  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        添加
      </Button>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns as ColumnTypes}
            rowKey="id" // 指定 key 属性
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: count,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </>
      )}
      <ModalForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSave={handleSave}
        initialValues={editingRecord}
      />
    </div>
  );
};

const ModalForm: React.FC<{
  visible: boolean;
  onCancel: () => void;
  onSave: (values: DataType) => void;
  initialValues?: DataType | null;
}> = ({ visible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
      onCancel();
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? 'Edit Record' : 'Add Record'}
      okText="Save"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="desc"
          label="Description"
          rules={[{ required: true, message: 'Please input the description' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default App;
