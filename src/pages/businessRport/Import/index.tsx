import React, { useEffect, useState } from 'react';
import { Button, Radio, DatePicker, Table, Upload, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, Link } from 'umi';
import { IConnectState } from '@/models/connect';
import { IFile } from '@/models/bs';
import { RadioChangeEvent } from 'antd/es/radio';
import { TablePaginationConfig } from 'antd/es/table';
import moment, { Moment } from 'moment';
import { requestErrorFeedback, Iconfont } from '@/utils/utils';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import bsTips from '@/assets/bsTips.png';
import classnames from 'classnames';
import { RcFile } from 'antd/lib/upload';
import { PaperClipOutlined } from '@ant-design/icons';
import styles from './index.less';

const { RangePicker } = DatePicker;

const BsImport: React.FC = function () {
  const dispatch = useDispatch();
  const page = useSelector((state: IConnectState) => state.bs);
  const {
    list: { records, size, current, total },
    filtrateParams: { startDate, endDate, status },
    fileList,
    completedNum,
    pluginStatus: { date: pluginDate, status: pluginStatus },
  } = page;
  let rangePickerDates = [startDate, endDate];
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId, storeName, marketplace } = currentShop;
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['bs/fetchBsList'];
  const uploading = loadingEffect['bs/uploadBs'];
  // 是否已经点击批量导入
  const [startUpload, setStartUpload] = useState<boolean>(false);
  // 切换店铺
  useEffect(() => {
    if (currentShopId !== '-1') {
      dispatch({
        type: 'bs/fetchBsList',
        payload: {
          filtrateParams: {
            current: 1,
            size: 20,
          },
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
      // 挂载时开启插件状态轮询
      dispatch({
        type: 'bs/pollPluginStatus-start',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
      });
    }
    return () => {
      // 卸载时关闭
      dispatch({
        type: 'bs/pollPluginStatus-stop',
      });
    };
  }, [dispatch, currentShopId]);
  // 最近 n 天的站点时间范围
  const { start: start3, end } = getTimezoneDateRange(3);
  const { start: start7 } = getTimezoneDateRange(7);
  const { start: start30 } = getTimezoneDateRange(30);

  // 日期选择配置
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RangePickerConfig: any = {
    ranges: {
      '最近3天': [start3, end],
      '最近7天': [start7, end],
      '最近30天': [start30, end],
    },
    dateFormat: 'YYYY-MM-DD',
    allowClear: false,
    defaultValue: [startDate || moment().subtract(2, 'years'), endDate || end],
    onChange: (_: Moment, dates: string[]) => {
      rangePickerDates = [...dates];
    },
    onOpenChange: (isOpen: boolean) => {
      if (isOpen || (rangePickerDates[0] === startDate && rangePickerDates[1] === endDate)) {
        return;
      }
      dispatch({
        type: 'bs/fetchBsList',
        payload: {
          filtrateParams: {
            startDate: rangePickerDates[0],
            endDate: rangePickerDates[1],
            current: 1,
          },
        },
      });
    },
    disabled: loading,
  };

  // 分页配置
  const paginationProps: TablePaginationConfig = {
    total,
    current,
    pageSize: size,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showTotal: (total: number) => (<>共 {total} 个</>),
    onChange: (current, pageSize) => {
      dispatch({
        type: 'bs/fetchBsList',
        payload: {
          // 如果改变了 pageSize， 则重置为第一页
          filtrateParams: { current: pageSize === size ? current : 1, size: pageSize },
        },
        callback: requestErrorFeedback,
      });
    },
  };

  // 生成更新/导入配置
  const getUploadProps = (url: string, id?: string) => {
    return {
      action: url,
      accept: '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      name: 'file',
      showUploadList: false,
      headers: { StoreId: currentShopId },
      beforeUpload: (file: File) => {
        if (file.size > 10485760) {
          message.error('文件大小不能超过10M');
          return false;
        }
        return true;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: (info: any) => {
        if (info.file.status === 'done') {
          if (info.fileList[0].response.code === 200) {
            message.success(info.fileList[0].response.message || '操作成功');
            // 导入后修改页面状态
            if (id) {
              dispatch({
                type: 'bs/updateBsStatus',
                payload: { id, reportStatus: true },
              });
            }
          } else {
            message.error(info.fileList[0].response.message || '网络有点问题，操作失败');
          }
        } else if (info.file.status === 'error') {
          message.error('发生错误，操作失败');
        }
      },
    };
  };

  // 批量上传的单个上传
  const uploadFile = (myFile: IFile) => {
    // 超过 size 限制的不上传
    if (myFile.isUpload) {
      return;
    }
    dispatch({
      type: 'bs/uploadBs',
      payload: {
        myFile,
        headersParams: { StoreId: currentShopId },
      },
    });
  };

  // 点击批量上传
  const handleBatchUpload = () => {
    setStartUpload(true);
    fileList.forEach((myFile: IFile) => {
      uploadFile(myFile);
    });
  };

  // 批量上传配置
  const batchUploadProps = {
    accept: '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    name: 'file',
    showUploadList: false,
    multiple: true,
    beforeUpload: (file: RcFile) => {
      const payload = { file, isUpload: false, msg: '' };
      // 文件带下限制 10M
      if (file.size > 10485760) {
        payload.isUpload = true;
        payload.msg = '大小不能超过10M';
      }
      dispatch({
        type: 'bs/pushFileList',
        payload,
      });
      return false;
    },
    fileList: fileList.map(myFile => myFile.file),
  };

  // 筛选状态
  const handleRadioChange = (e: RadioChangeEvent) => {
    dispatch({
      type: 'bs/fetchBsList',
      payload: {
        filtrateParams: {
          status: e.target.value,
        },
      },
    });
  };

  // 删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      content: (
        <>
          <ExclamationCircleOutlined className={styles.warnIcon} />删除报表将影响数据统计和分析，继续删除？
        </>
      ),
      icon: null,
      className: styles.modalConfirm,
      maskClosable: true,
      centered: true,
      onOk() {
        dispatch({
          type: 'bs/deleteBs',
          payload: { id },
        });
      },
    });
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    dispatch({
      type: 'bs/emptyFileList',
    });
  };

  // 批量导入完成刷新列表
  const handleFinish = () => {
    setStartUpload(false);
    dispatch({
      type: 'bs/emptyFileList',
    });
    dispatch({
      type: 'bs/fetchBsList',
      payload: {
        headersParams: { StoreId: currentShopId },
      },
      callback: requestErrorFeedback,
    });
  };

  // 弹窗的按钮
  const footer = (
    <div className={styles.modalFooter}>
      <div className={styles.progress}>
        {completedNum ? `${completedNum}/${fileList.length}` : null }
      </div>
      {
        startUpload
          ?
          <>
            <Button loading={uploading} type="primary" onClick={handleFinish}>
              { uploading ? '正在导入' : '完成' }
            </Button>
          </>
          :
          <>
            <Button onClick={handleCloseModal}>取消</Button>
            <Button type="primary" onClick={handleBatchUpload}>导入</Button>
          </>
      }
    </div>
  );

  // 弹窗的每一个文件
  const renderFile = (myFile: IFile) => (
    <div
      className={classnames(styles.file, myFile.msg ? styles.error : null)}
      key={myFile.file.name}
    >
      <span className={styles.fileName}>
        <PaperClipOutlined />
        {myFile.file.name}
      </span>
      {
        myFile.isUpload
          ?
          <div className={styles.fileStatus}>
            {
              myFile.msg
                ? <span className={styles.fileMsg}>{myFile.msg}</span>
                : <Iconfont type="icon-dui" className={styles.checkIcon} />
            }
          </div>
          :
          <Iconfont
            type="icon-cuo"
            className={styles.closeIcon}
            onClick={() => {
              dispatch({
                type: 'bs/removeFile',
                payload: { myFile },
              });
            }}
          />
      }
    </div>
  );

  // 插件同步状态
  const getPluginStatus = () => {
    if (!pluginDate) {
      return null;
    }
    let text = '';
    switch (pluginStatus) {
    case 0:
      text = `插件正在自动导入${pluginDate}`;
      break;      
    case 1:
      text = `${pluginDate}插件自动导入成功`;
      break;
    case 2:
      text = `插件自动导入${pluginDate}失败，等待下一次导入`;
      break;
    default:
      break;
    }
    return (
      <div className={styles.carousel}>
        <Iconfont type="icon-yiwen" className={styles.query} />
        { text }
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>
        Business Rport导入
      </div>
      <div className={styles.pageContent}>
        <div className={styles.left}>
          <div className={styles.head}>
            <div className={styles.importBtn}>
              <Upload {...batchUploadProps}>
                <Button type="primary">批量导入</Button>
              </Upload>
            </div>
            <span className={styles.title}>状态：</span>
            <Radio.Group
              options={[
                { label: '全部', value: '' },
                { label: '已导入', value: '1' },
                { label: '未导入', value: '0' },
              ]}
              value={status}
              onChange={e => handleRadioChange(e)}
            />
            <div className={styles.rangePicker}>
              <RangePicker {...RangePickerConfig} />
            </div>
          </div>
          <Table
            className={styles.Table}
            scroll={{ x: 'max-content', y: 'calc(100vh - 260px)', scrollToFirstRowOnChange: true }}
            loading={loading}
            columns={[
              {
                title: '日期',
                dataIndex: 'reportTime',
                align: 'center',
                width: 240,
              }, {
                title: '状态',
                dataIndex: 'reportStatus',
                align: 'center',
                width: 400,
                render: (reportStatus, record) => {
                  return (
                    <>
                      { reportStatus ? '已导入' : null }
                      { 
                        record.pluginMsg
                          ? <span className={styles.pluginMsg}> ({record.pluginMsg})</span>
                          : null
                      }
                    </>
                  );
                },
              }, {
                title: <span className={styles.rightGap}>操作</span>,
                align: 'center',
                width: 260,
                fixed: 'right',
                render: (_, record) => (
                  <div className={styles.btns}>
                    {
                      record.reportStatus
                        ?
                        <>
                          <Upload {...getUploadProps('/api/mws/bs/update-bs')} data={{ id: record.id }}>更新</Upload>
                          <Link
                            to={`/report/details?date=${record.reportTime}&reportId=${record.id}`}
                            target="_blank"
                          >详情</Link>
                          <span
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(record.id)}
                          >删除</span>
                        </>
                        :
                        <Upload className={styles.rightGap} {...getUploadProps('/api/mws/bs/upload', record.id)} data={{ id: record.id }}>导入</Upload>
                    }
                  </div>
                ),
              },
            ]}
            rowKey="reportTime"
            dataSource={records}
            locale={{ emptyText: '未找到相关数据' }}
            showSorterTooltip={false}
            pagination={{ ...paginationProps, size: 'default' }}
          />
        </div>
        <div className={styles.right}>
          { getPluginStatus() }
          <div className={styles.direction}>
            <h5>方法1 :手动导入</h5>
            <p>
              1. 前往亚马逊后台的Business Report页面<br/>
              2. 选择Detail Page Sales and Traffic by Child Item报表<br/>
              3. 按天下载，修改文件名，格式为：yyyymmdd，例如2021年01月01日的报表，文件名改为20210101.csv<br/>
              4. 点击批量导入按钮，按住Ctrl键，选择多个文件导入<br/>
            </p>
            <h6>注意事项：</h6>
            <p> 
              • 若重复导入，以最后一次导入的数据为准<br/>
              • 导入的文件单个不能超过10MB<br/>
              • 若文件导入失败，请检查文件名或文件内容是否有误<br/>
            </p>
            <h5>方法2 :自动导入</h5>
            <p>
              1. 在常用于登录亚马逊后台的电脑的浏览器上安装插件，
              <a href="/index/crx">安装地址<Iconfont type="icon-zhankai" className={styles.icon} /></a><br/>
              2. 在插件上使用安知账号登录<br/>
              3. 打开自动导入开关<br/>
              4. 打开亚马逊后台的Business Report页面，插件会自动导入报表到安知<br/>
            </p>
            <h6>注意事项：</h6>
            <p>
              • 第一次会自动导入近2年的报表，耗时较长，后续每天导入近15天的报表<br/>
              • 需要在安知绑定店铺，未绑定的店铺不会自动同步报表<br/>
            </p>
            <div className={styles.imgContainer}>
              <img src={bsTips} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={`确认将以下文件导入 ${marketplace}_${storeName} 店铺？`}
        visible={!!fileList.length}
        width={520}
        closable={false}
        keyboard={false}
        mask={false}
        maskClosable={false}
        footer={false}
        className={styles.Modal}
      >
        <div className={styles.modalFileList}>
          {
            fileList.map((myFile: IFile) => {
              return renderFile(myFile);
            })
          }
        </div>
        { footer }
      </Modal>
    </div>
  );
};

export default BsImport;
