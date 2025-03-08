var links = [
    {
        name: "Alan Becker视频列表",
        icon: "video_library--outlined",
        desc: "（站外）免_获取Alan Becker的YouTube视频列表（标题时间链接）",
        url: "https://forthezero.pythonanywhere.com/ab",
        github: null,
        slot: {
            time: 0,
            recommend: -20,
            lang: "cn",
            ui: "mdb"
        }
    },

    {
        name: "Todo",
        icon: "task_alt--outlined",
        desc: "模仿别人做的todo，左键标记右键删除，手机长按=右键",
        url: "./todo/index.html",
        github: null,
        slot: {
            time: 1,
            recommend: -15,
            lang: "en",
            ui: "css"
        }
    },

    {
        name: "Zen",
        icon: "timer--outlined",
        desc: "<del>带记录功能的计时器……</del>一个Material3风格的简约专注网页，可显示一言句子，可以对专注计时进行统计",
        url: "./zen/index.html",
        github: null,
        slot: {
            time: 2,
            recommend: -65,
            lang: "cn",
            ui: "material-web"
        }
    },

    {
        name: "简单日历",
        icon: "date_range--outlined",
        desc: "简约的日历，就只由简单的日历功能",
        url: "./calendar/index.html",
        github: null,
        slot: {
            time: 3,
            recommend: 0,
            lang: "cn",
            ui: "mdui"
        }
    },

    {
        name: "震动测试",
        icon: "vibration--outlined",
        desc: "仅限带线性马达的手机，随便搞的，更新了2.0版本，但还是不如意……",
        url: "./playvib/1.html",
        github: null,
        slot: {
            time: 4,
            recommend: -70,
            lang: "cn",
            ui: "no"
        }
    },

    {
        name: "QpenForm",
        icon: "question_answer--outlined",
        desc: "此处仅限前端部分",
        url: "./form/index.html",
        github: "https://github.com/for-the-zero/QpenForm",
        slot: {
            time: 5,
            recommend: 1,
            lang: "cn",
            ui: "mdui"
        }
    },

    {
        name: "TypeTo",
        icon: "keyboard--outlined",
        desc: "（仅限电脑使用，需要键盘）将键盘上的按键映射成其它字符，可以拿来整活",
        url: "./typeto/index.html",
        github: null,
        slot: {
            time: 6,
            recommend: -30,
            lang: "cn",
            ui: "mdui"
        }
    },

    {
        name: "Passkey",
        icon: "password",
        desc: "生成图像密文，不提供解密（懒）",
        url: "./passkey/index.html",
        github: null,
        slot: {
            time: 7,
            recommend: -100,
            lang: "cn",
            ui: "no"
        }
    },

    {
        name: "VisualVoice",
        icon: "voicemail",
        desc: "将声音转换成颜色",
        url: "./vv/index.html",
        github: null,
        slot: {
            time: 8,
            recommend: -80,
            lang: "en",
            ui: "no"
        }
    },

    {
        name: "Taple",
        icon: "table_chart--outlined",
        desc: "一个好看的表格，用canvas绘制",
        url: "./taple/index.html",
        github: "https://github.com/for-the-zero/Taple",
        slot: {
            time: 9,
            recommend: 100,
            lang: "en",
            ui: "css"
        }
    },

    {
        name: "文本展示",
        icon: "smart_screen--outlined",
        desc: "将文本展示在屏幕上",
        url: "./showon/index.html",
        github: null,
        slot: {
            time: 10,
            recommend: -60,
            lang: "cn",
            ui: "material-web"
        }
    },

    {
        name: "UP主动态查看器",
        icon: "post_add",
        desc: "查看UP主的动态",
        url: "./updyn/index.html",
        github: "https://github.com/for-the-zero/UpDyn",
        slot: {
            time: 11,
            recommend: 50,
            lang: "cn",
            ui: "mdui"
        }
    }
];

const cate_order = {
    lang: [['cn','中文'],['en','English']],
    ui: [
        ['mdui','mdui'],
        ['css','自己写的css/css by myself'],
        ['material-web','material-web'],
        ['mdb','MDBootstrap'],
        ['no','无样式/No Style']
    ]
};
