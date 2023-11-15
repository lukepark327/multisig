"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandMsg = exports.hashToField = exports.FIELD_ORDER = void 0;
var ethers_1 = require("ethers");
var utils_1 = require("ethers/lib/utils");
exports.FIELD_ORDER = ethers_1.BigNumber.from('0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47');
function hashToField(domain, msg, count) {
    var u = 48;
    var _msg = expandMsg(domain, msg, count * u);
    var els = [];
    for (var i = 0; i < count; i++) {
        var el = ethers_1.BigNumber.from(_msg.slice(i * u, (i + 1) * u)).mod(exports.FIELD_ORDER);
        els.push(el);
    }
    return els;
}
exports.hashToField = hashToField;
function expandMsg(domain, msg, outLen) {
    if (domain.length > 255) {
        throw new Error('bad domain size');
    }
    var out = new Uint8Array(outLen);
    var len0 = 64 + msg.length + 2 + 1 + domain.length + 1;
    var in0 = new Uint8Array(len0);
    // zero pad
    var off = 64;
    // msg
    in0.set(msg, off);
    off += msg.length;
    // l_i_b_str
    in0.set([(outLen >> 8) & 0xff, outLen & 0xff], off);
    off += 2;
    // I2OSP(0, 1)
    in0.set([0], off);
    off += 1;
    // DST_prime
    in0.set(domain, off);
    off += domain.length;
    in0.set([domain.length], off);
    var b0 = (0, utils_1.sha256)(in0);
    var len1 = 32 + 1 + domain.length + 1;
    var in1 = new Uint8Array(len1);
    // b0
    in1.set((0, utils_1.arrayify)(b0), 0);
    off = 32;
    // I2OSP(1, 1)
    in1.set([1], off);
    off += 1;
    // DST_prime
    in1.set(domain, off);
    off += domain.length;
    in1.set([domain.length], off);
    var b1 = (0, utils_1.sha256)(in1);
    // b_i = H(strxor(b_0, b_(i - 1)) || I2OSP(i, 1) || DST_prime);
    var ell = Math.floor((outLen + 32 - 1) / 32);
    var bi = b1;
    for (var i = 1; i < ell; i++) {
        var ini = new Uint8Array(32 + 1 + domain.length + 1);
        var nb0 = (0, utils_1.zeroPad)((0, utils_1.arrayify)(b0), 32);
        var nbi = (0, utils_1.zeroPad)((0, utils_1.arrayify)(bi), 32);
        var tmp = new Uint8Array(32);
        for (var i_1 = 0; i_1 < 32; i_1++) {
            tmp[i_1] = nb0[i_1] ^ nbi[i_1];
        }
        ini.set(tmp, 0);
        var off_1 = 32;
        ini.set([1 + i], off_1);
        off_1 += 1;
        ini.set(domain, off_1);
        off_1 += domain.length;
        ini.set([domain.length], off_1);
        out.set((0, utils_1.arrayify)(bi), 32 * (i - 1));
        bi = (0, utils_1.sha256)(ini);
    }
    out.set((0, utils_1.arrayify)(bi), 32 * (ell - 1));
    return out;
}
exports.expandMsg = expandMsg;
var DOMAIN_STR = 'QUUX-V01-CS02-with-expander';
var DST = Uint8Array.from(Buffer.from(DOMAIN_STR, 'utf8'));
var vectors = [
    // https://tools.ietf.org/html/draft-irtf-cfrg-hash-to-curve-09#appendix-I
    {
        msg: '',
        outLen: 32,
        expected: '0xf659819a6473c1835b25ea59e3d38914c98b374f0970b7e4c92181df928fca88',
    },
    {
        msg: 'abc',
        outLen: 32,
        expected: '0x1c38f7c211ef233367b2420d04798fa4698080a8901021a795a1151775fe4da7',
    },
    {
        msg: 'abcdef0123456789',
        outLen: 32,
        expected: '0x8f7e7b66791f0da0dbb5ec7c22ec637f79758c0a48170bfb7c4611bd304ece89',
    },
    {
        msg: 'q128_qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
        outLen: 32,
        expected: '0x72d5aa5ec810370d1f0013c0df2f1d65699494ee2a39f72e1716b1b964e1c642',
    },
    {
        msg: 'a512_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        outLen: 32,
        expected: '0x3b8e704fc48336aca4c2a12195b720882f2162a4b7b13a9c350db46f429b771b',
    },
    {
        msg: '',
        outLen: 128,
        expected: '0x8bcffd1a3cae24cf9cd7ab85628fd111bb17e3739d3b53f89580d217aa79526f1708354a76a402d3569d6a9d19ef3de4d0b991e4f54b9f20dcde9b95a66824cbdf6c1a963a1913d43fd7ac443a02fc5d9d8d77e2071b86ab114a9f34150954a7531da568a1ea8c760861c0cde2005afc2c114042ee7b5848f5303f0611cf297f',
    },
    {
        msg: 'abc',
        outLen: 128,
        expected: '0xfe994ec51bdaa821598047b3121c149b364b178606d5e72bfbb713933acc29c186f316baecf7ea22212f2496ef3f785a27e84a40d8b299cec56032763eceeff4c61bd1fe65ed81decafff4a31d0198619c0aa0c6c51fca15520789925e813dcfd318b542f8799441271f4db9ee3b8092a7a2e8d5b75b73e28fb1ab6b4573c192',
    },
    {
        msg: 'abcdef0123456789',
        outLen: 128,
        expected: '0xc9ec7941811b1e19ce98e21db28d22259354d4d0643e301175e2f474e030d32694e9dd5520dde93f3600d8edad94e5c364903088a7228cc9eff685d7eaac50d5a5a8229d083b51de4ccc3733917f4b9535a819b445814890b7029b5de805bf62b33a4dc7e24acdf2c924e9fe50d55a6b832c8c84c7f82474b34e48c6d43867be',
    },
    {
        msg: 'q128_qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
        outLen: 128,
        expected: '0x48e256ddba722053ba462b2b93351fc966026e6d6db493189798181c5f3feea377b5a6f1d8368d7453faef715f9aecb078cd402cbd548c0e179c4ed1e4c7e5b048e0a39d31817b5b24f50db58bb3720fe96ba53db947842120a068816ac05c159bb5266c63658b4f000cbf87b1209a225def8ef1dca917bcda79a1e42acd8069',
    },
    {
        msg: 'a512_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        outLen: 128,
        expected: '0x396962db47f749ec3b5042ce2452b619607f27fd3939ece2746a7614fb83a1d097f554df3927b084e55de92c7871430d6b95c2a13896d8a33bc48587b1f66d21b128a1a8240d5b0c26dfe795a1a842a0807bb148b77c2ef82ed4b6c9f7fcb732e7f94466c8b51e52bf378fba044a31f5cb44583a892f5969dcd73b3fa128816e',
    },
];
var chai_1 = require("chai");
function test_expand_msg() {
    for (var i = 0; i < vectors.length; i++) {
        var v = vectors[i];
        var msg = Uint8Array.from(Buffer.from(v.msg, 'utf8'));
        var outLen = v.outLen;
        var out = expandMsg(DST, msg, outLen);
        chai_1.assert.equal((0, utils_1.hexlify)(out), v.expected);
    }
}
function test_hash_to_point() {
    var expected0 = '0x09b6a2dec1f1b0747c73332e5147ecacde20767f28a9b68261713bed9a1d2432';
    var expected1 = '0x0cb70ff0b1bdb5d30006bd0cc03dc2c071dcff0daea886c9793f304c695c1bc6';
    var dst = 'xxx';
    var msg = '0x616263';
    mcl.setDomain(dst);
    var p = mcl.hashToPoint(msg);
    var result = mcl.g1ToHex(p);
    chai_1.assert.equal(result[0], expected0);
    chai_1.assert.equal(result[1], expected1);
}
var mcl = require("./mcl");
function test() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mcl.init()];
                case 1:
                    _a.sent();
                    test_expand_msg();
                    console.log('expand msg test pass');
                    test_hash_to_point();
                    console.log('hash to point test pass');
                    return [2 /*return*/];
            }
        });
    });
}
// test();
