import React, { useState } from 'react';
import './App.css';
import { Col, Row, Button, Divider, Modal, Select, message, Upload, Switch, Radio, notification } from 'antd';
import { ClockCircleOutlined, FileTextFilled, InboxOutlined, MinusCircleFilled, PlusCircleFilled, UploadOutlined } from '@ant-design/icons';
import { clients } from './utils/vars';

const clientOptions = [
  {
    label: 'Select Client',
    value: ''
  },
  ...clients
];

const { Dragger } = Upload;

const draggerProps = {
  name: 'file',
  multiple: true,
  action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [splitSchedule, setSplitSchedule] = useState(1);
  const [clientType, setClientType] = useState(1);
  const [singleSelectedClient, setSingleSelectedClient] = useState({ value: '' , label: 'Select Client' })
  const [selectedClients, setSelectedClients] = useState([{ value: '', label: 'Select Client' }]);
  const [isTolerance, setIsTolerance] = useState(true);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleUpload = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeTolerance = (checked) => {
    console.log(`switch to ${checked}`);
  };

  const onChangeSplitSchedule = (e) => {
    console.log('radio checked', e.target.value);
    setSplitSchedule(e.target.value);
  };

  const onChangeClientType = (e) => {
    console.log('radio checked', e.target.value);
    setClientType(e.target.value);
  };

  const onAddSelectedClient = (index) => {
    if (!selectedClients[index].value) {
      notification.error({
        message: `Please select the Testing Client ${index + 1}`
      });
      return;
    }

    setSelectedClients([
      ...selectedClients,
      {
        label: 'Select Client',
        value: '',
      }
    ]);
  };

  const onRemoveSelectedClient = (index) => {
    const arrayData = selectedClients;

    arrayData.splice(index, 1);

    setSelectedClients([
      ...arrayData,
    ]);
  };

  const onSelectSelectedClients = (e, index) => {
    if (clientType == 1) {
      setSingleSelectedClient(clientOptions.filter((client) => client.value == e)[0]);
    }else {
      const selectedClients0 = selectedClients;

      selectedClients0[index] = clientOptions.filter((client) => client.value == e)[0];

      setSelectedClients([
        ...selectedClients0,
      ]);
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="#"
          rel="noopener noreferrer"
          onClick={showModal}
        >
          Upload Document
        </a>
      </header>
      <Modal
        centered
        open={isModalOpen}
        onOk={handleUpload}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <Row gutter={20}>
          <Col span={24}>
            <h1>Document Upload</h1>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={14}>
            <Row gutter={20}>
              <Col span="24">
                <Select
                  style={{ width: "100%", height: "36px" }}
                  options={[
                    {
                      label: 'Select Import Name:',
                      value: ''
                    }
                  ]}
                  defaultValue={''}
                ></Select>
              </Col>
              <Divider style={{ width: "60%", minWidth: "60%" }} />
              <Col span="24" className='h-fit-content'>
                <h3>Select a manifest that you'd like to import</h3>
                <Dragger {...draggerProps} className='upload-drag'>
                  <div className='drag-section'>
                    <p className="ant-upload-drag-icon">
                      <FileTextFilled />
                    </p>
                    <p className="ant-upload-text">Drag & Drop Here Or Browse</p>
                  </div>
                  <Button className='small-btn primary-btn upload-btn' icon={<UploadOutlined />}>Upload Manifest</Button>
                </Dragger>
              </Col>
              <Divider />
              <Col span="24">
                <h3>Elapse Data Checking:</h3>
                <span className='value-color'>No Elapsed Dates!</span>
              </Col>
              <Divider />
              <Col span="24">
                <h3>Tolerance Window</h3>
                <div className='d-flex i-align-center'>
                  <Switch
                    defaultChecked
                    onChange={onChangeTolerance}
                    className='tolerance-switch'
                    checked={isTolerance}
                    onClick={() => setIsTolerance(!isTolerance)}
                  />
                  <span className='tolerance-switch-label'>Switch {isTolerance ? "ON" : "OFF"}</span> | 
                  <ClockCircleOutlined className='tolerance-level-icon' />
                  <span>Select Tolerance Level</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={10}>
            <Row gutter={20}>
              <Col span="24">
                <h3>Split schedule using social distancing?</h3>
                <Radio.Group onChange={onChangeSplitSchedule} value={splitSchedule}>
                  <Radio value={1}>Yes</Radio>
                  <Radio value={2}>No</Radio>
                </Radio.Group>
              </Col>
              <Divider />
              <Col span="24">
                <h3>Location Checking:</h3>
                <span className='value-color'>All Available!</span>
              </Col>
              <Divider />
              <Col span="24">
                <Row gutter={20}>
                  <Col span="24" className='mb-2'>
                    <h3>Client:</h3>
                    <Radio.Group onChange={onChangeClientType} value={clientType}>
                      <Radio value={1}>Single</Radio>
                      <Radio value={2}>Multiple</Radio>
                    </Radio.Group>
                  </Col>
                  {clientType == 1 ? (
                    <Col span="24">
                      <span>Testing Center </span>
                      <Select
                        options={clientOptions}
                        style={{ width: 120, marginLeft: 20 }}
                        value={singleSelectedClient}
                        onSelect={(e) => onSelectSelectedClients(e, 0)}
                      />
                    </Col>) : selectedClients.map((el, index) => (
                    <Col key={index} span="24" className='mb-2 d-flex i-align-center'>
                      <span>Testing Center {index + 1}</span>
                      <Select
                        style={{ width: 120, marginLeft: 20 }}
                        options={clientOptions}
                        value={el.value}
                        onSelect={(e) => onSelectSelectedClients(e, index)}
                      />
                      <PlusCircleFilled onClick={() => onAddSelectedClient(index)} className='success-color testing-client-icon' />
                      {selectedClients.length > 1 && <MinusCircleFilled onClick={() => onRemoveSelectedClient(index)} className='warning-color testing-client-icon' />}
                    </Col>))
                  }
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={20} className='modal-footer'>
          <Col span={24}>
            <h3 className='t-align-center'>Data in the import file is correct. Please press Continue to import.</h3>
          </Col>
          <Col span={24} className='footer-btns d-flex justify-center'>
            <Button className='normal-btn primary-btn ml-1 mr-1'>Continue Import</Button>
            <Button className='normal-btn secondary-btn ml-1 mr-1'>Cancel</Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default App;
