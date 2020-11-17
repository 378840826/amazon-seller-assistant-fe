import { IModelType } from '@/models/connect.d';
interface IDynamicType extends IModelType{
  namespace: 'dynamicAsin';
}
const Dynamic: IDynamicType = {
  namespace: 'dynamicAsin',
};
export default Dynamic;
