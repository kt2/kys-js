(function (PIXI, g, c, window) {
    'use strict';

    c.Type = function(j) {
        this.j = j;
        this.teammate_count = 6;
        this.battle_enemy_count = 20;
        this.shop_item_count = 5;
        Object.assign(this, {
            submap_coord_count : 64,
            submap_layer_count : 6,
            mainmap_coord_count : 480,
            battle_coord_count : 64,
            battle_save_layer_count : 2,
            submap_event_count : 200,
            max_magic_level_index : 9,
            max_magic_level : 999,
            role_magic_count : 10,
            role_taking_item_count : 4,
            item_in_bag_count : 200,
            'schema' : {
                'saveData' : {
                    InShip : 'int32',
                    InSubMap : 'int32',
                    MainMapX : 'int32',
                    MainMapY : 'int32',
                    SubMapX : 'int32',
                    SubMapY : 'int32',
                    FaceTowards : 'int32',
                    ShipX : 'int32',
                    ShipY : 'int32',
                    ShipX1 : 'int32',
                    ShipY1 : 'int32',
                    Encode : 'int32',
                    Team : ['array', 'int32', this.teammate_count],
                    Items: ['array', 'ItemList']

                },
                'magicSave' : {
                    ID: 'int32',
                    Name: ['string', 20, 'big5'],
                    Unknown: ['array', 'int32', 5],
                    SoundID: 'int32',
                    MagicType: 'int32',
                    EffectID: 'int32',
                    HurtType: 'int32',
                    AttackAreaType: 'int32',
                    NeedMP: 'int32',
                    WithPoison: 'int32',
                    Attack: ['array', 'int32', 10],
                    SelectDistance: ['array', 'int32', 10],
                    AttackDistance: ['array', 'int32', 10],
                    AddMP: ['array', 'int32', 10],
                    HurtMP: ['array', 'int32', 10],
                },
                'roleSave' : {
                    ID: 'int32',
                    HeadID: 'int32',
                    IncLife: 'int32',
                    UnUse: 'int32',
                    Name: ['string', 20, 'big5'],
                    Nick: ['string', 20, 'big5'],
                    Sexual: 'int32',
                    Level: 'int32',
                    Exp: 'int32',
                    HP: 'int32',
                    MaxHP: 'int32',
                    Hurt: 'int32',
                    Poison: 'int32',
                    PhysicalPower: 'int32',
                    ExpForMakeItem: 'int32',
                    Equip0: 'int32',
                    Equip1: 'int32',
                    Frame: ['array', 'int32', 15],
                    MPType: 'int32',
                    MP: 'int32',
                    MaxMP: 'int32',
                    Attack: 'int32',
                    Speed: 'int32',
                    Defence: 'int32',
                    Medcine: 'int32',
                    UsePoison: 'int32',
                    Detoxification: 'int32',
                    AntiPoison: 'int32',
                    Fist: 'int32',
                    Sword: 'int32',
                    Knife: 'int32',
                    Unusual: 'int32',
                    HiddenWeapon: 'int32',
                    Knowledge: 'int32',
                    Morality: 'int32',
                    AttackWithPoison: 'int32',
                    AttackTwice: 'int32',
                    Fame: 'int32',
                    IQ: 'int32',
                    PracticeItem: 'int32',
                    ExpForItem: 'int32',
                    MagicID: ['array', 'int32', 10],
                    MagicLevel: ['array', 'int32', 10],
                    TakingItem: ['array', 'int32', 4],
                    TakingItemCount: ['array', 	'int32', 4],
                },
                'ItemSave' : {
                    ID : 'int32',
                    Name : ['string', 40, 'big5'],
                    Name1 : ['array', 'int32', 10],
                    Introduction : ['string', 60, 'big5'],
                    MagicID : 'int32',
                    HiddenWeaponEffectID : 'int32',
                    User : 'int32',
                    EquipType : 'int32',
                    ShowIntroduction : 'int32',
                    ItemType : 'int32',
                    UnKnown5 : 'int32',
                    UnKnown6 : 'int32',
                    UnKnown7 : 'int32',
                    AddHP : 'int32',
                    AddMaxHP : 'int32',
                    AddPoison : 'int32',
                    AddPhysicalPower : 'int32',
                    ChangeMPType : 'int32',
                    AddMP : 'int32',
                    AddMaxMP : 'int32',
                    AddAttack : 'int32',
                    AddSpeed : 'int32',
                    AddDefence : 'int32',
                    AddMedcine : 'int32',
                    AddUsePoison : 'int32',
                    AddDetoxification : 'int32',
                    AddAntiPoison : 'int32',
                    AddFist : 'int32',
                    AddSword : 'int32',
                    AddKnife : 'int32',
                    AddUnusual : 'int32',
                    AddHiddenWeapon : 'int32',
                    AddKnowledge : 'int32',
                    AddMorality : 'int32',
                    AddAttackTwice : 'int32',
                    AddAttackWithPoison : 'int32',
                    OnlySuitableRole : 'int32',
                    NeedMPType : 'int32',
                    NeedMP : 'int32',
                    NeedAttack : 'int32',
                    NeedSpeed : 'int32',
                    NeedUsePoison : 'int32',
                    NeedMedcine : 'int32',
                    NeedDetoxification : 'int32',
                    NeedFist : 'int32',
                    NeedSword : 'int32',
                    NeedKnife : 'int32',
                    NeedUnusual : 'int32',
                    NeedHiddenWeapon : 'int32',
                    NeedIQ : 'int32',
                    NeedExp : 'int32',
                    NeedExpForMakeItem : 'int32',
                    NeedMaterial : 'int32',
                    MakeItem : ['array', 'int32', 5],
                    MakeItemCount : ['array', 'int32', 5]
                },
                'subMapInfoSave' : {
                    ID: 'int32',
                    Name: ['string', 20, 'big5'],
                    ExitMusic: 'int32',
                    EntranceMusic: 'int32',
                    JumpSubMap: 'int32',
                    EntranceCondition: 'int32',
                    MainEntranceX1: 'int32',
                    MainEntranceY1: 'int32',
                    MainEntranceX2: 'int32',
                    MainEntranceY2: 'int32',
                    EntranceX: 'int32',
                    EntranceY: 'int32',
                    ExitX: ['array', 'int32', 3],
                    ExitY: ['array', 'int32', 3],
                    JumpX: 'int32',
                    JumpY: 'int32',
                    JumpReturnX: 'int32',
                    JumpReturnY: 'int32'
                },
                'subMapEventList' : {
                    Items: ['array', 'subMapEvent']
                },
                'battleInfoList' : {
                    Items: ['array', 'battleInfo']
                },
                'shopSave' : {
                    ItemID: ['array', 'int32', this.shop_item_count],
                    Total: ['array', 'int32', this.shop_item_count],
                    Price: ['array', 'int32', this.shop_item_count]
                }

                // 'subMapEvent' : {
                // CannotWalk: 'int16',
                // Index: 'int16',
                // Event1: 'int16',
                // Event2: 'int16',
                // Event3: 'int16',
                // CurrentPic: 'int16',
                // EndPic: 'int16',
                // BeginPic: 'int16',
                // PicDelay: 'int16',
                // x: 'int16',
                // y: 'int16'

                // }
            }
        });
    };
    c.Type.constructor = c.Type;

    c.item = function(data, j) {
        this.j = j;
        this.data = data;
        Object.assign(this, {

        });
    }
    c.item.prototype.constructor = c.item;

    c.item.prototype.isCompass = function() {
        this.ID == this.j.op.CompassItemID;
    };
    c.saveData = function(data) {
        this.data = data;
        Object.assign(this, {

        });
    };
    c.saveData.prototype.constructor = c.saveData;


    c.magic = function(data, j) {
        this.j = j;
        this.data = data;
        Object.assign(this, {
            max_magic_level_index : 9
        });
    }
    c.magic.prototype.constructor = c.magic;
    c.magic.prototype.calMaxLevelIndexByMP = function(mp, max_level) {
        var max_level = this.j.gameutil.limit(max_level, 0, this.max_magic_level_index);
        if (this.data.NeedMP <= 0) {
            return max_level;
        }
        var level = this.j.gameutil.limit(mp / (this.data.NeedMP * 2) * 2 - 1, 0, max_level);
        return level;
    };
    c.magic.prototype.calNeedMP = function(level_index) {
        return this.data.NeedMP * ((level_index + 2) / 2);
    };
    c.shop = function(data) {
        this.data = data;
    };
    c.role = function(data, j) {
        this.j = j;
        this.data = data;
        Object.assign(this, {
            Team : 0,
            FaceTowards : 0,
            Dead : 0,
            Step : 0,
            ExpGot : 0,
            Auto : 0,
            FightFrame : [],
            FightingFrame : 0,
            Moved : 0,
            Acted : 0,
            ActTeam : 0,
            ShowString : "",
            role_magic_count : 10,
            magicID : [],
            position_layer : {},
            AI_MoveX : null,
            AI_MoveY : null,
            AI_ActionX : null,
            AI_ActionY : null,
            AI_Magic : null,
            AI_Item : null,
            prevX : null,
            prevY : null,
            AI_Action : 0,
            dead_alpha : 255
        });
    }
    c.role.prototype.constructor = c.role;

    c.role.prototype.learnMagic = function(magic_id) {
        if (magic_id <= 0) {
            return -1;
        }
        var index = -1;
        for (var i = 0; i < this.role_magic_count; i++) {
            if (this.data.MagicID[i] == magic_id) {
                if (this.data.MagicLevel[i] / 100 < this.j.type.max_magic_level_index) {
                    this.data.MagicLevel[i] += 100;
                    return 0;
                }
                else {
                    return -2;
                }
            }
            if (this.data.MagicID[i] <= 0 && index == -1) {
                index = i;
            }
        }
        if (index < 0) {
            return -3;
        }
        else {
            this.data.MagicID[index] = magic_id;
            this.data.MagicLevel[index] = 0;
            return 0;
        }
    };
    c.role.prototype.limit = function() {
        this.data.Level = this.j.gameutil.limit(this.data.Level, 0, this.j.op.MaxLevel);
        this.data.Exp = this.j.gameutil.limit(this.data.Exp, 0, this.j.op.MaxExp);
        this.data.ExpForItem = this.j.gameutil.limit(this.data.ExpForItem, 0, this.j.op.MaxExp);
        this.data.ExpForMakeItem = this.j.gameutil.limit(this.data.ExpForMakeItem, 0, this.j.op.MaxExp);

        this.data.Poison = this.j.gameutil.limit(this.data.Poison, 0, this.j.op.MaxPosion);

        this.data.MaxHP = this.j.gameutil.limit(this.data.MaxHP, 0, this.j.op.MaxHP);
        this.data.MaxMP = this.j.gameutil.limit(this.data.MaxMP, 0, this.j.op.MaxMP);
        this.data.HP = this.j.gameutil.limit(this.data.HP, 0, this.data.MaxHP);
        this.data.MP = this.j.gameutil.limit(this.data.MP, 0, this.data.MaxMP);
        this.data.PhysicalPower = this.j.gameutil.limit(this.data.PhysicalPower, 0, this.j.op.MaxPhysicalPower);

        this.data.Attack = this.j.gameutil.limit(this.data.Attack, 0, this.j.op.MaxAttack);
        this.data.Defence = this.j.gameutil.limit(this.data.Defence, 0, this.j.op.MaxDefence);
        this.data.Speed = this.j.gameutil.limit(this.data.Speed, 0, this.j.op.MaxSpeed);

        this.data.Medcine = this.j.gameutil.limit(this.data.Medcine, 0, this.j.op.MaxMedcine);
        this.data.UsePoison = this.j.gameutil.limit(this.data.UsePoison, 0, this.j.op.MaxUsePoison);
        this.data.Detoxification = this.j.gameutil.limit(this.data.Detoxification, 0, this.j.op.MaxDetoxification);
        this.data.AntiPoison = this.j.gameutil.limit(this.data.AntiPoison, 0, this.j.op.MaxAntiPoison);

        this.data.Fist = this.j.gameutil.limit(this.data.Fist, 0, this.j.op.MaxFist);
        this.data.Sword = this.j.gameutil.limit(this.data.Sword, 0, this.j.op.MaxSword);
        this.data.Knife = this.j.gameutil.limit(this.data.Knife, 0, this.j.op.MaxKnife);
        this.data.Unusual = this.j.gameutil.limit(this.data.Unusual, 0, this.j.op.MaxUnusual);
        this.data.HiddenWeapon = this.j.gameutil.limit(this.data.HiddenWeapon, 0, this.j.op.MaxHiddenWeapon);

        this.data.Knowledge = this.j.gameutil.limit(this.data.Knowledge, 0, this.j.op.MaxKnowledge);
        this.data.Morality = this.j.gameutil.limit(this.data.Morality, 0, this.j.op.MaxMorality);
        this.data.AttackWithPoison = this.j.gameutil.limit(this.data.AttackWithPoison, 0, this.j.op.MaxAttackWithPoison);
        this.data.Fame = this.j.gameutil.limit(this.data.Fame, 0, this.j.op.MaxFame);
        this.data.IQ = this.j.gameutil.limit(this.data.IQ, 0, this.j.op.MaxIQ);
        for (var i = 0; i < this.j.type.role_magic_count; i++) {
            this.j.gameutil.limit(this.data.MagicLevel[i], 0, this.j.type.role_magic_count);
        }
    };

    c.role.prototype.setPrevPosition = function(x, y) {
        this.prevX = x;
        this.prevY = y;
    };
    c.role.prototype.isAuto = function() {
        return (this.Auto != 0 || this.Team != 0);
    };
    c.role.prototype.getRoleMagicIndex = function(r, i) {
        if (i < 0 || i >= this.role_magic_count) {
            return null;
        }
        return this.getMagic(r.data.MagicID[i]);

    };
    c.role.prototype.setPosition = function(x, y) {
        // if (this.position_layer == null) {
        // return;
        // }

        if (parseInt(this.data.X) >= 0 && parseInt(this.data.Y) >= 0) {
            g.utils.setData(this.position_layer, this.data.X, this.data.Y, 64, null);
        }

        if (x >= 0 && y >= 0) {
            g.utils.setData(this.position_layer, x, y, 64, this);
        }
        this.data.X = x;
        this.data.Y = y;
    };
    c.role.prototype.getMagicOfRoleIndex = function(magic) {
        for (var i = 0; i < this.role_magic_count; i++) {
            if (this.data.MagicID[i] == magic.data.ID) {
                return i;
            }
        }
        return -1;
    };
    c.role.prototype.setRolePositionLayer = function(l) {
        this.position_layer = l;
    };
    c.role.prototype.getLearnedMagicCount = function() {
        var n = 0;
        for (var i = 0; i < this.role_magic_count; i++) {
            if (this.data.MagicID[i] > 0) {
                n++;
            }
        }
        return n;
    };
    c.role.prototype.getRoleMagicLevelIndex = function(i) {
        var l = parseInt(this.data.MagicLevel[i] / 100);
        if (l < 0) {
            l = 0;
        }
        if (l > 9) {
            l = 9;
        }
        return l;
        // for (var i = 0; i < this.role_magic_count; i++) {
        // if (this.data.MagicID[i] == magic_id) {
        // return this.getRoleMagicLevelIndex(i);
        // }
        // }
        // return -1;
    };
    c.role.prototype.getMagicLevelIndex = function(magic_id) {
        for (var i = 0; i < this.role_magic_count; i++) {
            if (this.data.MagicID[i] == magic_id) {
                return this.getRoleMagicLevelIndex(i);
            }
        }
        return -1;
    };

    c.role.prototype.getRoleShowLearnedMagicLevel = function(i) {
        return this.getRoleMagicLevelIndex(i) + 1;
    };



    c.subMapEvent = function(data) {
        this.data = data;
    }
    c.subMapEvent.prototype.constructor = c.subMapEvent;
    c.subMapEvent.prototype.setPosition = function(x, y, submap_record) {
        if (x < 0) {
            x = this.data.X;
        }
        if (y < 0) {
            y = this.data.Y;
        }
        var index = submap_record.eventIndex(this.data.X, this.data.Y);
        submap_record.setEventIndex(this.data.X, this.data.Y, -1);
        this.data.X = x;
        this.data.Y = y;
        submap_record.setEventIndex(this.data.X, this.data.Y, index);

    };
    c.subMapEvent.prototype.setPic = function(start, end) {
        this.data.BeginPic = start;
        this.data.CurrentPic = start;
        this.data.EndPic = end;
        this.data.EventEnd = end;
    };

    c.subMapInfo = function(data, j) {
        //this.j = j;
        this.data = data;
        this.layer_data = [];
        this.events = [];
    }

    c.subMapInfo.prototype.constructor = c.subMapInfo;
    c.subMapInfo.prototype.layerData = function(layer, x, y) {
        return this.layer_data[layer][x + y * 64]; //this.j.type.submap_coord_count];
    };
    c.subMapInfo.prototype.earth = function(x, y) {
        return this.layerData(0, x, y);
    };
    c.subMapInfo.prototype.building = function(x, y) {
        return this.layerData(1, x, y);
    };
    c.subMapInfo.prototype.decoration = function(x, y) {
        return this.layerData(2, x, y);
    };
    c.subMapInfo.prototype.setEventIndex = function(x, y, v) {
        this.layer_data[3][x + y * 64] = v;
    };
    c.subMapInfo.prototype.eventIndex = function(x, y) {
        return this.layerData(3, x, y);
    };
    c.subMapInfo.prototype.buildingHeight = function(x, y) {
        return this.layerData(4, x, y);
    };
    c.subMapInfo.prototype.decorationHeight = function(x, y) {
        return this.layerData(5, x, y);
    };
    c.subMapInfo.prototype.event = function(x, y) {
        var i = this.eventIndex(x, y);
        return this.events[i];
    };

})(PIXI, g, c, window);
