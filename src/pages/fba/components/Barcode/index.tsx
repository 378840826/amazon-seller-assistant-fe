import React, { useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import styles from './index.less';

interface IProps{
    fontSize: number;
    value: string;
    barcodewidthprops: number;
    id: string;
}

const Barcode: React.FC<IProps> = (props) => {
  const { fontSize, value, barcodewidthprops, id } = props;
  const jsbarcode = JsBarcode;
  useEffect(() => {
    jsbarcode(
      `#b${id}`, 
      value, {
        format: 'CODE128',
        font: 'IDAutomationSC128S',
        fontSize: fontSize,
        height: 50,
        width: 2,
      });//eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div style={{ width: barcodewidthprops }}>
      <svg id={`b${id}`} className={styles.barcode}></svg>
    </div>
  );
};
export default Barcode;
