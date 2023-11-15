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
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
exports.randG2 = exports.randG1 = exports.randFr = exports.newG2 = exports.newG1 = exports.compressSignature = exports.compressPubkey = exports.aggreagate = exports.sign = exports.newKeyPair = exports.g2ToHex = exports.g2ToBN = exports.g2ToCompressed = exports.g1ToHex = exports.g1ToBN = exports.g1ToCompressed = exports.signOfG2 = exports.signOfG1 = exports.g2 = exports.g1 = exports.mclToHex = exports.mapToPoint = exports.hashToPoint = exports.setMappingMode = exports.setDomainHex = exports.setDomain = exports.init = exports.MAPPING_MODE_FT = exports.MAPPING_MODE_TI = void 0;
var ethers_1 = require("ethers");
var utils_1 = require("./utils");
var hash_to_field_1 = require("./hash_to_field");
var mcl = require('mcl-wasm');
exports.MAPPING_MODE_TI = 'TI';
exports.MAPPING_MODE_FT = 'FT';
var DOMAIN;
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mcl.init(mcl.BN_SNARK1)];
                case 1:
                    _a.sent();
                    setMappingMode(exports.MAPPING_MODE_FT);
                    return [2 /*return*/];
            }
        });
    });
}
exports.init = init;
function setDomain(domain) {
    DOMAIN = Uint8Array.from(Buffer.from(domain, 'utf8'));
}
exports.setDomain = setDomain;
function setDomainHex(domain) {
    DOMAIN = Uint8Array.from(Buffer.from(domain, 'hex'));
}
exports.setDomainHex = setDomainHex;
function setMappingMode(mode) {
    if (mode === exports.MAPPING_MODE_FT) {
        mcl.setMapToMode(0);
    }
    else if (mode === exports.MAPPING_MODE_TI) {
        mcl.setMapToMode(1);
    }
    else {
        throw new Error('unknown mapping mode');
    }
}
exports.setMappingMode = setMappingMode;
function hashToPoint(msg) {
    if (!ethers_1.ethers.utils.isHexString(msg)) {
        throw new Error('message is expected to be hex string');
    }
    var _msg = Uint8Array.from(Buffer.from(msg.slice(2), 'hex'));
    var hashRes = (0, hash_to_field_1.hashToField)(DOMAIN, _msg, 2);
    var e0 = hashRes[0];
    var e1 = hashRes[1];
    var p0 = mapToPoint(e0.toHexString());
    var p1 = mapToPoint(e1.toHexString());
    var p = mcl.add(p0, p1);
    p.normalize();
    return p;
}
exports.hashToPoint = hashToPoint;
function mapToPoint(eHex) {
    var e0 = (0, utils_1.toBig)(eHex);
    var e1 = new mcl.Fp();
    e1.setStr(e0.mod(utils_1.FIELD_ORDER).toString());
    return e1.mapToG1();
}
exports.mapToPoint = mapToPoint;
function mclToHex(p, prefix) {
    if (prefix === void 0) { prefix = true; }
    var arr = p.serialize();
    var s = '';
    for (var i = arr.length - 1; i >= 0; i--) {
        s += ('0' + arr[i].toString(16)).slice(-2);
    }
    return prefix ? '0x' + s : s;
}
exports.mclToHex = mclToHex;
function g1() {
    var g1 = new mcl.G1();
    g1.setStr('1 0x01 0x02', 16);
    return g1;
}
exports.g1 = g1;
function g2() {
    var g2 = new mcl.G2();
    g2.setStr('1 0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed 0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2 0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa 0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b');
    return g2;
}
exports.g2 = g2;
function signOfG1(p) {
    var y = (0, utils_1.toBig)(mclToHex(p.getY()));
    var ONE = (0, utils_1.toBig)(1);
    return y.and(ONE).eq(ONE);
}
exports.signOfG1 = signOfG1;
function signOfG2(p) {
    p.normalize();
    var y = mclToHex(p.getY(), false);
    var ONE = (0, utils_1.toBig)(1);
    return (0, utils_1.toBig)('0x' + y.slice(64))
        .and(ONE)
        .eq(ONE);
}
exports.signOfG2 = signOfG2;
function g1ToCompressed(p) {
    var MASK = (0, utils_1.toBig)('0x8000000000000000000000000000000000000000000000000000000000000000');
    p.normalize();
    if (signOfG1(p)) {
        var x = (0, utils_1.toBig)(mclToHex(p.getX()));
        var masked = x.or(MASK);
        return (0, utils_1.bigToHex)(masked);
    }
    else {
        return mclToHex(p.getX());
    }
}
exports.g1ToCompressed = g1ToCompressed;
function g1ToBN(p) {
    p.normalize();
    var x = (0, utils_1.toBig)(mclToHex(p.getX()));
    var y = (0, utils_1.toBig)(mclToHex(p.getY()));
    return [x, y];
}
exports.g1ToBN = g1ToBN;
function g1ToHex(p) {
    p.normalize();
    var x = mclToHex(p.getX());
    var y = mclToHex(p.getY());
    return [x, y];
}
exports.g1ToHex = g1ToHex;
function g2ToCompressed(p) {
    var MASK = (0, utils_1.toBig)('0x8000000000000000000000000000000000000000000000000000000000000000');
    p.normalize();
    var x = mclToHex(p.getX(), false);
    if (signOfG2(p)) {
        var masked = (0, utils_1.toBig)('0x' + x.slice(64)).or(MASK);
        return [(0, utils_1.bigToHex)(masked), '0x' + x.slice(0, 64)];
    }
    else {
        return ['0x' + x.slice(64), '0x' + x.slice(0, 64)];
    }
}
exports.g2ToCompressed = g2ToCompressed;
function g2ToBN(p) {
    var x = mclToHex(p.getX(), false);
    var y = mclToHex(p.getY(), false);
    return [
        (0, utils_1.toBig)('0x' + x.slice(64)),
        (0, utils_1.toBig)('0x' + x.slice(0, 64)),
        (0, utils_1.toBig)('0x' + y.slice(64)),
        (0, utils_1.toBig)('0x' + y.slice(0, 64)),
    ];
}
exports.g2ToBN = g2ToBN;
function g2ToHex(p) {
    p.normalize();
    var x = mclToHex(p.getX(), false);
    var y = mclToHex(p.getY(), false);
    return ['0x' + x.slice(64), '0x' + x.slice(0, 64), '0x' + y.slice(64), '0x' + y.slice(0, 64)];
}
exports.g2ToHex = g2ToHex;
function newKeyPair() {
    var secret = randFr();
    var pubkey = mcl.mul(g2(), secret);
    pubkey.normalize();
    return { pubkey: pubkey, secret: secret };
}
exports.newKeyPair = newKeyPair;
function pubkeyFromSecret(secret) {
    // @lukepark327
    var frSecret = mcl.hashToFr(secret);
    var pubkey = mcl.mul(g2(), frSecret);
    pubkey.normalize();
    return { pubkey: pubkey, secret: frSecret };
}
exports.pubkeyFromSecret = pubkeyFromSecret;
function sign(message, secret) {
    var M = hashToPoint(message);
    var signature = mcl.mul(M, secret);
    signature.normalize();
    return { signature: signature, M: M };
}
exports.sign = sign;
function aggreagate(acc, other) {
    var _acc = mcl.add(acc, other);
    _acc.normalize();
    return _acc;
}
exports.aggreagate = aggreagate;
function compressPubkey(p) {
    return g2ToCompressed(p);
}
exports.compressPubkey = compressPubkey;
function compressSignature(p) {
    return g1ToCompressed(p);
}
exports.compressSignature = compressSignature;
function newG1() {
    return new mcl.G1();
}
exports.newG1 = newG1;
function newG2() {
    return new mcl.G2();
}
exports.newG2 = newG2;
function randFr() {
    var r = (0, utils_1.randHex)(12);
    console.log(r); // @lukepark327
    var fr = new mcl.Fr();
    fr.setHashOf(r);
    return fr;
}
exports.randFr = randFr;
function randG1() {
    var p = mcl.mul(g1(), randFr());
    p.normalize();
    return p;
}
exports.randG1 = randG1;
function randG2() {
    var p = mcl.mul(g2(), randFr());
    p.normalize();
    return p;
}
exports.randG2 = randG2;
