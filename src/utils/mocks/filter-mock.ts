// Develop vmgabriel

// Libraries
import * as R from 'ramda';

// Interfaces
import { IFilter, IAndOrFilter, IAttributeChange} from '../../interfaces/filter';

export const changeAttributes = (attributes: Array<IAttributeChange>) => (data: any) => {
  for (let [key, value] of Object.entries(data)) {
    const attrib = R.filter((attributeChange: IAttributeChange) =>
      attributeChange.column == key, attributes);

    if (attrib.length == 1) {
      data[attrib[0].as] = value;
      delete data[key];
    }
  }

  return data;
};

export function changeAttributesName(datas: Array<any>, attributes: Array<IAttributeChange>) {
  return R.map(changeAttributes(attributes), datas);
}

// export const filterData = (datas: Array<any>) => (query: IAndOrFilter) => {
//   let cond = '';
//   const generateCondition = (condition: string) => (filter: Array<IFilter>) => (datas: Array<any>) => {
//     if (condition == 'and') {
//       return R.filter(R.and(), datas);
//     } else {
      
//     }
//   };

//   if (!!query.and && !!query.or) {
//     cond = query.condition;
//   } else {
//     const find = (!!query.hasOwnProperty('and')) ? query.and : query.or;
//     cond = (!!query.hasOwnProperty('and')) ? 'and' : 'or';
//     if (Array.isArray(find)) {
      
//     } else {
      
//     }
//   }

//   return datas;
// };
