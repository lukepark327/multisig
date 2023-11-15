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
exports.inverse = exports.sqrt = exports.P_PLUS1_OVER4 = exports.randFsHex = exports.randFs = exports.bigToHex = exports.randBig = exports.randHex = exports.toBig = exports.TWO = exports.ONE = exports.ZERO = exports.FIELD_ORDER = void 0;
var utils_1 = require("ethers/lib/utils");
var ethers_1 = require("ethers");
var chai_1 = require("chai");
exports.FIELD_ORDER = ethers_1.BigNumber.from('0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47');
exports.ZERO = ethers_1.BigNumber.from('0');
exports.ONE = ethers_1.BigNumber.from('1');
exports.TWO = ethers_1.BigNumber.from('2');
function toBig(n) {
    return ethers_1.BigNumber.from(n);
}
exports.toBig = toBig;
function randHex(n) {
    return (0, utils_1.hexlify)((0, utils_1.randomBytes)(n));
}
exports.randHex = randHex;
function randBig(n) {
    return toBig((0, utils_1.randomBytes)(n));
}
exports.randBig = randBig;
function bigToHex(n) {
    return (0, utils_1.hexZeroPad)(n.toHexString(), 32);
}
exports.bigToHex = bigToHex;
function randFs() {
    var r = randBig(32);
    return r.mod(exports.FIELD_ORDER);
}
exports.randFs = randFs;
function randFsHex() {
    var r = randBig(32);
    return bigToHex(r.mod(exports.FIELD_ORDER));
}
exports.randFsHex = randFsHex;
exports.P_PLUS1_OVER4 = ethers_1.BigNumber.from('0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f52');
// export const P_MINUS3_OVER4 = BigNumber.from('0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f51');
// export const P_MINUS1_OVER2 = BigNumber.from('0x183227397098d014dc2822db40c0ac2ecbc0b548b438e5469e10460b6c3e7ea3');
function exp(a, e) {
    var z = ethers_1.BigNumber.from(1);
    var path = ethers_1.BigNumber.from('0x8000000000000000000000000000000000000000000000000000000000000000');
    for (var i = 0; i < 256; i++) {
        z = z.mul(z).mod(exports.FIELD_ORDER);
        if (!e.and(path).isZero()) {
            z = z.mul(a).mod(exports.FIELD_ORDER);
        }
        path = path.shr(1);
    }
    return z;
}
function sqrt(nn) {
    var n = exp(nn, exports.P_PLUS1_OVER4);
    var found = n.mul(n).mod(exports.FIELD_ORDER).eq(nn);
    return { n: n, found: found };
}
exports.sqrt = sqrt;
function inverse(a) {
    var z = exports.FIELD_ORDER.sub(exports.TWO);
    return exp(a, z);
}
exports.inverse = inverse;
function mulmod(a, b) {
    return a.mul(b).mod(exports.FIELD_ORDER);
}
function test_sqrt() {
    for (var i = 0; i < 100; i++) {
        var a = randFs();
        var aa = mulmod(a, a);
        var res = sqrt(aa);
        chai_1.assert.isTrue(res.found);
        chai_1.assert.isTrue(mulmod(res.n, res.n).eq(aa));
    }
    var nonResidues = [
        toBig('0x23d9bb51d142f4a4b8a533721a30648b5ff7f9387b43d4fc8232db20377611bc'),
        toBig('0x107662a378d9198183bd183db9f6e5ba271fbf2ec6b8b077dfc0a40119f104cb'),
        toBig('0x0df617c7a009e07c841d683108b8747a842ce0e76f03f0ce9939473d569ea4ba'),
        toBig('0x276496bfeb07b8ccfc041a1706fbe3d96f4d42ffb707edc5e31cae16690fddc7'),
        toBig('0x20fcdf224c9982c72a3e659884fdad7cb59b736d6d57d54799c57434b7869bb3'),
    ];
    for (var i = 0; i < nonResidues.length; i++) {
        var res = sqrt(nonResidues[i]);
        chai_1.assert.isFalse(res.found);
    }
}
function test_inv() {
    for (var i = 0; i < 100; i++) {
        var a = randFs();
        var ia = inverse(a);
        chai_1.assert.isTrue(mulmod(a, ia).eq(exports.ONE));
    }
}
function test() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            test_sqrt();
            test_inv();
            return [2 /*return*/];
        });
    });
}
// test();
