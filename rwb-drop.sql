delete from rwb_permissions;
delete from rwb_users;
delete from rwb_actions;
delete from rwb_opinions;
delete from rwb_cs_ind_to_geo;

commit;

drop table rwb_invited_permissions;
drop table rwb_invited;
drop table rwb_cs_ind_to_geo;
drop table rwb_opinions;
drop table rwb_permissions;
drop table rwb_actions;
drop table rwb_users;




quit;
