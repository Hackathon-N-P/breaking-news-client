import React, { useCallback } from 'react';
import { object, bool, number, string, func } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import {
  SafetyCertificateOutlined,
  CaretUpOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';
import { date } from 'relient/formatters';
import { map, size, includes, flow, slice, identity } from 'lodash/fp';
import { Button, Tag } from 'antd';
import classNames from 'classnames';
import { push } from 'relient/actions/history';
import { useDispatch } from 'react-redux';

import s from './viewpoint.less';

const SECURE_CREDIBILITY = 0;

const result = ({
  viewpoint: {
    id,
    author = {},
    title,
    content,
    images,
    likeAddresses = [],
    dislikeAddresses = [],
    createdAt,
    isSupport,
  },
  hasOperations = false,
  showTag = false,
  supportCount,
  notSupportCount,
  currentUserAddress,
  dislike,
  like,
  maxImages,
}) => {
  useStyles(s);
  const dispatch = useDispatch();
  const isLiked = includes(currentUserAddress)(likeAddresses);
  const isDisliked = includes(currentUserAddress)(dislikeAddresses);

  const onLike = useCallback(() => {
    if (!isLiked && !isDisliked) {
      like(id);
    }
  }, [isLiked, isDisliked, id]);

  const onDislike = useCallback(() => {
    if (!isLiked && !isDisliked) {
      dislike(id);
    }
  }, [isLiked, isDisliked, id]);

  const onTitleClick = useCallback(() => {
    dispatch(push(`/${id}`));
  }, [id]);

  const onSupport = useCallback(() => {
    dispatch(push(`/${id}/create/true`));
  }, [id]);

  const onAgainst = useCallback(() => {
    dispatch(push(`/${id}/create/false`));
  }, [id]);

  return (
    <div className={s.Root}>
      <div className={s.Numbers}>
        <div>
          <SafetyCertificateOutlined
            className={classNames(s.SecurityIcon, {
              [s.secure]: author.credibility >= SECURE_CREDIBILITY,
            })}
          />
        </div>
        <div className={s.Number} style={{ marginBottom: 20 }}>{author.credibility}</div>
        <div>
          <CaretUpOutlined
            onClick={onLike}
            className={classNames(s.UpIcon, {
              [s.active]: isLiked,
            })}
          />
        </div>
        <div className={s.Number}>{size(likeAddresses) - size(dislikeAddresses)}</div>
        <div>
          <CaretUpOutlined
            onClick={onDislike}
            className={classNames(s.DownIcon, {
              [s.active]: isDisliked,
            })}
          />
        </div>
      </div>

      <div>
        <div>
          <span className={s.Address}>{author.address}</span>
          <span className={s.lighten}>Created</span>: {date()(createdAt)}
          {showTag && <Tag className={s.Tag} color={isSupport ? 'success' : 'warning'}>{isSupport ? '支持' : '反对'}</Tag>}
        </div>
        {title && (
          <div className={s.Title} onClick={onTitleClick}>{title}</div>
        )}
        <div className={s.Content}>{content}</div>
        <div className={s.Images}>
          {flow(
            maxImages >= 0 ? slice(0, maxImages) : identity,
            map((hash) => (
              <img key={hash} className={s.Image} src={`//47.241.69.26:8080/ipfs/${hash}`} alt={title} />
            )),
          )(images)}
        </div>

        {hasOperations && (
          <div className={s.Operations}>
            <Button
              size="large"
              type="primary"
              className={s.Support}
              icon={<LikeOutlined />}
              onClick={onSupport}
            >
              {supportCount} 支持
            </Button>
            <Button
              size="large"
              className={s.NotSupport}
              icon={<DislikeOutlined />}
              onClick={onAgainst}
            >
              {notSupportCount} 反对
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

result.propTypes = {
  viewpoint: object.isRequired,
  hasOperations: bool,
  supportCount: number,
  notSupportCount: number,
  currentUserAddress: string,
  like: func.isRequired,
  dislike: func.isRequired,
  maxImages: number,
  showTag: bool,
};

result.displayName = __filename;

export default result;
