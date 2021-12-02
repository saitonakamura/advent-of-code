module Utils

/// Adapted from Seq.pairwise
let seqTriplewise (source: seq<'T>) =
    seq {
        use ie = source.GetEnumerator()

        if ie.MoveNext() then
            let mutable iref = ie.Current

            if ie.MoveNext() then
                let mutable iref2 = ie.Current

                while ie.MoveNext() do
                    let j = ie.Current
                    yield (iref, iref2, j)
                    iref <- iref2
                    iref2 <- j
    }
