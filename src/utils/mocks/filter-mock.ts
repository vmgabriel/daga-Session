// Develop vmgabriel

// Libraries
import * as R from 'ramda';

// Interfaces
import { IFilter, IAndOrFilter, IAttributeChange} from '../../interfaces/filter';

/**
 * Change the value of attributes in the mocks
 * @param attributes attributes to change
 */
export const changeAttributes = (attributes: Array<IAttributeChange>) => (data: any) => {
  for (let [key, value] of Object.entries(data)) {
    const attrib = R.filter((attributeChange: IAttributeChange) =>
      attributeChange.column === key, attributes);

    if (attrib.length === 1) {
      data[attrib[0].as] = value;
      delete data[key];
    }
  }

  return data;
};

/**
 * Change names of Attributes
 * @param datas datas
 * @param attributes attributes
 */
export function changeAttributesName(datas: Array<any>, attributes: Array<IAttributeChange>) {
  return R.map(changeAttributes(attributes), datas);
}

//   return datas;
// };
