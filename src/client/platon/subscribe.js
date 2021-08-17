import Web3 from 'libs/web3.min';
import { map } from 'lodash/fp';
import { decode } from 'micro-rlp';
import buffer from 'buffer/';
import abi from './breaking-news.abi';
import {
  serializeNews,
} from './serializer';

const web3 = new Web3('ws://47.241.98.219:6790');
const newsPromiseMap = new Map();
export const contract = new web3.platon.Contract(
  abi,
  'lat1af6hck97pxzsc8wekx42vx6r3mfc25t65szakz',
  { vmType: 1 },
);
const addNewsTopic = web3.utils.leftPad(web3.utils.toHex('AddNews'), 64);
const otherTopics = map((event) => web3.utils.leftPad(web3.utils.toHex(event), 64))([
  'BNMessage',
]);

export const waitForTransactionResult = (txHash) => new Promise((resolve, reject) => {
  newsPromiseMap.set(txHash, { resolve, reject });
});

export const start = () => {
  web3.platon.subscribe('logs', {
    address: contract.options.address,
    topics: [addNewsTopic],
  }, async (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
    const receipt = await web3.platon.getTransactionReceipt(result.transactionHash);
    const promise = newsPromiseMap.get(result.transactionHash);
    if (receipt && promise) {
      newsPromiseMap.delete(result.transactionHash);
      if (receipt.status) {
        const decodedData = decode(buffer.Buffer.from(result.data.replace('0x', ''), 'hex'));
        const news = web3.platon.abi.decodeParameters([{ type: 'News' }], decodedData[0]);
        promise.resolve(serializeNews(news));
      } else {
        promise.reject();
      }
    }
  });

  web3.platon.subscribe('logs', {
    address: contract.options.address,
    topics: otherTopics,
  }, async (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
    const receipt = await web3.platon.getTransactionReceipt(result.transactionHash);
    const promise = newsPromiseMap.get(result.transactionHash);
    if (receipt && promise) {
      newsPromiseMap.delete(result.transactionHash);
      if (receipt.status) {
        const resultString = web3.platon.abi.decodeParameters([{ type: 'string' }], result.data.replace('0x', ''));
        if (resultString === 'success') {
          promise.resolve();
        } else {
          promise.reject(resultString);
        }
      } else {
        promise.reject();
      }
    }
  });
};