import React, { useEffect, useState, useCallback } from 'react';

import { useRouter } from '../Router';

import { makeStyles } from '@material-ui/styles';

import { useDispatch } from 'redux-react-hook';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '../overrides/CardContent';
import CardActions from '../overrides/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import Loading from '../comps/Loading';
import UserAvatar from '../comps/UserAvatar';

import BasicLayout from '../layout/Basic';

import { NavLink } from 'react-router-dom';
import { get, fetchConf, fetchComms } from '../store/actions';

import { RegDetailDialog } from './Conference';

const styles = makeStyles(theme => ({
  logo: {
    height: 18,
    width: 18,
    marginRight: theme.spacing.unit,
  },

  abbr: {
    marginBottom: 0,
    color: 'rgba(0,0,0,.38)',
  },

  abbrLine: {
    display: 'flex',
    alignItems: 'center',
  },

  pageTitle: {
    marginTop: theme.spacing.unit,
    color: 'rgba(0,0,0,.54)',
  },

  title: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },

  avatar: {
    boxShadow: 'rgba(0,0,0,.3) 0 2px 6px',
    marginTop: 40,
    marginBottom: 20,
  },

  name: {
  },
}));

export default () => {
  const cls = styles();

  const { match } = useRouter();

  const [reg, setReg] = useState(null);
  const [comms, setComms] = useState(null);
  const [conf, setConf] = useState(null);

  const [regDetailOpen, setRegDetailOpen] = useState(false);
  const closeRegDetail = useCallback(() => setRegDetailOpen(false), [setRegDetailOpen]);
  const openRegDetail = useCallback(() => setRegDetailOpen(true), [setRegDetailOpen]);

  const dispatch = useDispatch();

  async function updateReg() {
    console.log(match.params);
    const reg = await dispatch(get(`/conference/${match.params.id}/list/${match.params.user}`));
    setReg(reg);
  }

  async function updateConf() {
    const conf = await dispatch(fetchConf(match.params.id, true));
    setConf(conf);
  };

  async function updateComms() {
    const conf = await dispatch(fetchComms(match.params.id, true));
    setComms(conf);
  };


  useEffect(() => {
    updateConf();
    updateComms();
    updateReg();
  }, [match.params.id, dispatch]);

  if(!reg) return <BasicLayout>
    <Loading />
  </BasicLayout>;

  return <BasicLayout>
    <Card>
      <CardContent className={cls.title}>
        <NavLink className={cls.abbrLine} to={`/conference/${match.params.id}`}>
          <Avatar src={conf.logo} className={cls.logo}/>
          <Typography variant="body2" className={cls.abbr}>{ conf.abbr }</Typography>
        </NavLink>

        <UserAvatar email={reg.user.email} name={reg.user.realname} size={120} className={cls.avatar} />
        <Typography variant="h4" className={cls.name}>{ reg.user.realname }</Typography>

        <List className={cls.info}>
          <ListItem>
            <ListItemIcon><Icon>email</Icon></ListItemIcon>
            <ListItemText primary={reg.user.email} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Icon>phone</Icon></ListItemIcon>
            <ListItemText primary={reg.user.profile.phone} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Icon>school</Icon></ListItemIcon>
            <ListItemText primary={reg.user.profile.school} />
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        <Button onClick={openRegDetail}>志愿详情</Button>
      </CardActions>
    </Card>

    <RegDetailDialog
      comms={comms || []}

      open={regDetailOpen}
      onClose={closeRegDetail}
      fullWidth

      value={reg.reg}
    />
  </BasicLayout>
}