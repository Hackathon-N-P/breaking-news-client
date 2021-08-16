import { GET_ALL as GET_ALL_USER } from 'shared/actions/user';
import {
  GET_ALL as GET_ALL_NEWS,
  CREATE,
  CREATE_VIEWPOINT,
  LIKE,
  LIKE_VIEWPOINT,
  DISLIKE,
  DISLIKE_VIEWPOINT,
  CANCEL_LIKE,
  CANCEL_LIKE_VIEWPOINT,
  CANCEL_DISLIKE,
  CANCEL_DISLIKE_VIEWPOINT,
} from 'shared/actions/news';
import Web3 from 'libs/web3.min';
import { map, includes } from 'lodash/fp';
import abi from './breaking-news.abi';

const web3 = new Web3('ws://47.241.98.219:6790');
const newsPromiseMap = new Map();

const contract = new web3.platon.Contract(
  abi,
  'lat13uqj8py6hul8y37t90wqh3lpgpxgcnk8xp278q',
  { vmType: 1 },
);
const hex = web3.utils.toHex('AddNews');
const topic = web3.utils.leftPad(hex, 64);
web3.platon.subscribe('logs', {
  address: 'lat13uqj8py6hul8y37t90wqh3lpgpxgcnk8xp278q',
  topics: [topic],
}, async (error, result) => {
  if (error) {
    console.error(error);
    return;
  }
  const receipt = await web3.platon.getTransactionReceipt(result.transactionHash);
  if (receipt) {
    if (receipt.status) {
      const newsId = web3.platon.abi.decodeParameters([{ type: 'uint[]' }], result.data.replace('0x', ''))[0];
      newsPromiseMap.get(result.transactionHash).resolve(newsId);
    } else {
      newsPromiseMap.get(result.transactionHash).reject();
    }
  }
});
const waitForNewsTransactionReceipt = (txHash) => new Promise((resolve, reject) => {
  newsPromiseMap.set(txHash, { resolve, reject });
});

const waitForTransactionReceipt = (txHash) => new Promise((resolve, reject) => {
  const interval = setInterval(() => {
    web3.platon.getTransactionReceipt(txHash, (error, result) => {
      if (error) {
        reject(interval);
        clearInterval(interval);
      } else if (result) {
        resolve(result);
        clearInterval(interval);
      }
    });
  }, 500);
});

const serializeViewpoint = ([
  isSupport,
  id,
  newsId,
  authorAddress,
  content,
  images,
  likeAddresses,
  dislikeAddresses,
  blockNumber,
  createdAt,
]) => ({
  isSupport,
  id,
  newsId,
  authorAddress,
  content,
  images,
  likeAddresses,
  dislikeAddresses,
  blockNumber,
  createdAt,
});

const deserializeViewpoint = ({
  newsId,
  content,
  images,
  isSupport,
  createdAt,
}) => [
  newsId,
  content,
  images,
  isSupport,
  createdAt,
];

const serializeNews = ([
  title,
  id,
  authorAddress,
  content,
  images,
  likeAddresses,
  dislikeAddresses,
  blockNumber,
  createdAt,
  viewpoints,
]) => ({
  title,
  id,
  authorAddress,
  content,
  images,
  likeAddresses,
  dislikeAddresses,
  blockNumber,
  createdAt,
  viewpoints: map(serializeViewpoint)(viewpoints),
});

const deserializeNews = ({
  title,
  content,
  images,
  createdAt,
}) => [
  title,
  content,
  images,
  createdAt,
];

const serializeUser = ([
  address,
  credibility,
]) => ({
  address,
  credibility,
});

const methodMap = {
  [LIKE]: 'likeNews',
  [DISLIKE]: 'dislikeNews',
  [CANCEL_LIKE]: 'cancellikeNews',
  [CANCEL_DISLIKE]: 'canceldislikeNews',
  [LIKE_VIEWPOINT]: 'likeViewpoint',
  [DISLIKE_VIEWPOINT]: 'dislikeViewpoint',
  [CANCEL_LIKE_VIEWPOINT]: 'cancellikeViewpoint',
  [CANCEL_DISLIKE_VIEWPOINT]: 'canceldislikeViewpoint',
};

export default () => (next) => async (action) => {
  const { type, payload } = action;
  if (type === GET_ALL_USER) {
    const method = contract.methods.getUsers.apply(contract.methods, []);
    const result = await method.call();
    return next({ ...action, payload: map(serializeUser)(result) });
  }
  if (type === GET_ALL_NEWS) {
    const method = contract.methods.getNews.apply(contract.methods, []);
    const result = await method.call();
    return next({ ...action, payload: map(serializeNews)(result) });
  }
  if (type === CREATE) {
    const data = contract.methods.createNews(...deserializeNews(payload)).encodeABI();
    const txHash = await window.platon.request({
      method: 'platon_sendTransaction',
      params: [{
        data,
        from: window.platon.selectedAddress,
        to: contract.options.address,
      }],
    });
    const result = await waitForNewsTransactionReceipt(txHash);
    return next({ ...action, payload: result });
  }
  if (type === CREATE_VIEWPOINT) {
    const data = contract.methods.createViewPoint(...deserializeViewpoint(payload)).encodeABI();
    const txHash = await window.platon.request({
      method: 'platon_sendTransaction',
      params: [{
        data,
        from: window.platon.selectedAddress,
        to: contract.options.address,
      }],
    });
    const result = await waitForTransactionReceipt(txHash);
    return next({ ...action, payload: result });
  }
  if (includes(type)([
    LIKE,
    LIKE_VIEWPOINT,
    DISLIKE,
    DISLIKE_VIEWPOINT,
    CANCEL_LIKE,
    CANCEL_LIKE_VIEWPOINT,
    CANCEL_DISLIKE,
    CANCEL_DISLIKE_VIEWPOINT,
  ])) {
    const data = contract.methods[methodMap[type]](payload).encodeABI();
    const txHash = await window.platon.request({
      method: 'platon_sendTransaction',
      params: [{
        data,
        from: window.platon.selectedAddress,
        to: contract.options.address,
      }],
    });
    const result = await waitForTransactionReceipt(txHash);
    return next({ ...action, payload: result });
  }
  return next(action);
};
