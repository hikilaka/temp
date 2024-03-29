const Long = require('long');

function toCharArray(s) {
    let a = new Uint16Array(s.length);

    for (let i = 0; i < s.length; i += 1) {
        a[i] = s.charCodeAt(i);
    }

    return a;
}

class Packet {
    constructor() {
        this.readTries = 0;
        this.maxReadTries = 0;
        this.packetStart = 0;
        this.packetData = null;
        this.isaacIncoming = null;
        this.isaacOutgoing = null;
        this.length = 0;
        this.socketException = false;
        this.delay = 0;

        this.packetEnd = 3;
        this.packet8Check = 8;
        this.packetMaxLength = 5000;
        this.socketExceptionMessage = '';
    }

    seedIsaac(seed) {
        // TODO toggle ISAAC
        //this.isaacIncoming = new ISAAC(seed);
        //this.isaacOutgoing = new ISAAC(seed);
    }

    closeStream() {
    }

    async readBytes(len, buff) {
        await this.readStreamBytes(len, 0, buff);
    }

    readPacket(buff) {
        try {
            this.readTries++;

            if (this.maxReadTries > 0 && this.readTries > this.maxReadTries) {
                this.socketException = true;
                this.socketExceptionMessage = 'time-out';
                this.maxReadTries += this.maxReadTries;

                return 0;
            }

            if (this.length === 0 && this.availableStream() >= 2) {
                this.length = this.readStream();

                if (this.length >= 160) {
                    this.length = (this.length - 160) * 256 + this.readStream();
                }
            }

            if (this.length > 0 && availableStream() >= this.length) {
                if (this.length >= 160) { 
                    this.readBytes(this.length, buff);
                } else {
                    buff[this.length - 1] = this.readStream() & 0xff;

                    if (this.length > 1) {
                        this.readBytes(this.length - 1, buff);
                    }
                }

                let i = length;
                this.length = 0;
                this.readTries = 0;

                return i;
            }
        } catch (e) {
            this.socketException = true;
            this.socketExceptionMessage = e.message;
        }

        return 0;
    }

    availableStream() {
        return 0;
    }

    async readStreamBytes(i, j, abyte0) {
    }

    hasPacket() {
        return this.packetStart > 0;
    }

    writePacket(i) {
        if (this.socketException) {
            this.packetetStart = 0;
            this.packetetEnd = 3;
            this.socketException = false;
            throw Error(this.socketExceptionMessage);
        }

        this.delay++;

        if (this.delay < i) {
            return;
        }

        if (this.packetStart > 0) {
            this.delay = 0;
            this.writeStreamBytes(this.packetData, 0, this.packetStart);
        }

        this.packetStart = 0;
        this.packetEnd = 3;
    }

    sendPacket() {
        if (this.isaacOutgoing !== null) {
            let i = this.packetData[this.packetStart + 2] & 0xff;
            this.packetData[this.packetStart + 2] = (i + isaacOutgoing.getNextValue()) & 0xff;
        }

        // what the fuck is this even for? legacy?
        if (this.packet8Check !== 8)  {
            this.packetEnd++;
        }

        let j = this.packetEnd - this.packetStart - 2;

        if (j >= 160) {
            this.packetData[this.packetStart] = (160 + j / 256) & 0xff;
            this.packetData[this.packetStart + 1] = (j & 0xff);
        } else {
            this.packetData[this.packetStart] = j & 0xff;
            this.packetEnd--;
            this.packetData[this.packetStart + 1] = this.packetData[this.packetEnd];
        }

        // this seems largely useless and doesn't appear to do anything
        if (this.packetMaxLength <= 10000) {
            let k = this.packetData[this.packetStart + 2] & 0xff;

            this.anIntArray537[k]++;
            this.anIntArray541[k] += this.packetEnd - this.packetStart;
        }

        this.packetStart = this.packetEnd;
    }

    putBytes(src, srcPos, len) {
        for (let k = 0; k < len; k++) {
            this.packetData[this.packetEnd++] = src[srcPos + k] & 0xff;
        }

        this.packetEnd += len;
    }

    putLong(l) {
        this.putInt(l.shiftRight(32).toInt());
        this.putInt(l.toInt());
    }

    newPacket(i) {
        if (this.packetStart > (((this.packetMaxLength * 4) / 5) | 0))
            try {
                this.writePacket(0);
            } catch (e) {
                this.socketException = true;
                this.socketExceptionMessage = e.message;
            }

        if (this.packetData === null) {
            this.packetData = new Int8Array(this.packetMaxLength);
        }

        this.packetData[this.packetStart + 2] = i & 0xff;
        this.packetData[this.packetStart + 3] = 0;
        this.packetEnd = this.packetStart + 3;
        this.packet8Check = 8;
    }

    writeStreamBytes(abyte0, i, j) {
    }

    async readStream() {
        return 0;
    }

    async getLong() {
        let l = await this.getShort();
        let l1 = await this.getShort();
        let l2 = await this.getShort();
        let l3 = await this.getShort();

        return Long.fromInt(l).shiftLeft(48).add(l1 << 32).add(l2 << 16).add(l3);
    }

    putShort(i) {
        this.packetData[this.packetEnd++] = (i >> 8) & 0xff;
        this.packetData[this.packetEnd++] = i & 0xff;
    }

    putInt(i) {
        this.packetData[this.packetEnd++] = (i >> 24) & 0xff;
        this.packetData[this.packetEnd++] = (i >> 16) & 0xff;
        this.packetData[this.packetEnd++] = (i >> 8) & 0xff;
        this.packetData[this.packetEnd++] =  i & 0xff;
    }

    async getShort() {
        let i = await this.getByte();
        let j = await this.getByte();

        return i * 256 + j;
    }

    putString(s) {
        this.putBytes(toCharArray(s), 0, s.length);
        this.packetEnd += s.length;
    }

    putByte(i) {
        this.packetData[packetEnd++] = i & 0xff;
    }

    isaacCommand(i) {
        // TODO toggle ISAA
        //return i - isaacIncoming.getNextValue() & 0xff;
        return i;
    }

    async getByte() {
        return await this.readStream();
    }

    flushPacket() {
        this.sendPacket();
        this.writePacket(0);
    }
}

Packet.anIntArray537 = new Int32Array(256);
Packet.anIntArray541 = new Int32Array(256);

module.exports = Packet;