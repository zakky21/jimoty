import { isNotNilEmpty } from '@/lib/wrapper/ramda';
import dayjs, { PluginFunc } from 'dayjs';

const plugin: PluginFunc = (_option, clz) => {
  clz.prototype.str = function () {
    return this.format('YYYY-MM-DD');
  };
  clz.prototype.strFull = function () {
    return this.format('YYYY-MM-DD HH:mm:ss');
  };
  clz.prototype.diffWithToday = function () {
    const s1 = this.str(),
      s2 = dayjs().str();
    if (s1 === s2) return 0;
    else if (s1 < s2) return -1;
    else return 1;
  };
  clz.prototype.between = function ({ start, end }) {
    const str = this.str();
    const _toStr = (target: string | dayjs.Dayjs) => {
      return dayjs.isDayjs(target) ? target.str() : target;
    };
    if (isNotNilEmpty(start) && str < _toStr(start!)) return false;
    if (isNotNilEmpty(end) && str > _toStr(end!)) return false;
    return true;
  };
};

declare module 'dayjs' {
  interface Dayjs {
    str(): string;
    strFull(): string;
    diffWithToday(): number;
    isHoliday(): boolean;
    between({ start, end }: { start?: string | dayjs.Dayjs | null; end?: string | dayjs.Dayjs | null }): boolean;
  }
}

dayjs.extend(plugin);

export default dayjs;
