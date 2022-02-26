import Int "mo:base/Int";
import Array "mo:base/Array";

actor Main {
    // Sort an array of integers.
    public query func qsort(xs : [Int]) : async [Int] {
        let n = xs.size();
        if (n < 2) {
            return xs;
        } else {
            // 将不可变数组转换为可变数组
            let result = Array.thaw<Int>(xs);
            quicksort(result, 0, n - 1);
            // 将可变数组转换为不可变数组
            return Array.freeze<Int>(result);
        };
    };

    private func quicksort(xs : [var Int],l : Int,r : Int) {
        if (l < r) {
            var i: Int = l;
            var j: Int = r;
            var swap  = xs[0];
            let pivot = xs[Int.abs(l + r) / 2];
            while (i <= j) {
                while (Int.less(xs[Int.abs(i)] ,pivot)) {
                    i += 1;
                };
                while (Int.greater(xs[Int.abs(j)] ,pivot)) {
                    j -= 1;
                };
                if (i <= j) {
                    swap := xs[Int.abs(i)];
                    xs[Int.abs(i)] := xs[Int.abs(j)];
                    xs[Int.abs(j)] := swap;
                    i += 1;
                    j -= 1;
                };
            };
            if (l < j) {
                quicksort(xs, l, j);
            };
            if (i < r) {
                quicksort(xs, i, r);
            };
        };
    };
};