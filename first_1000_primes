((lambda (dividesP)
    ((lambda (prime_loop)
       ((lambda (isPrimeP)
          ((lambda (loop) ((loop loop) 10000))
           (lambda (loop)
             (lambda (n)
               (ifleq0
                (+ n (* -1 2))
                (ifleq0
                 (+ 2 (* -1 n))
                 2
                 (ifleq0
                  (+ ((isPrimeP isPrimeP) n) (* -1 1))
                  (ifleq0
                   (+ 1 (* -1 ((isPrimeP isPrimeP) n)))
                   ((lambda (x) ((loop loop) (+ n -1)))
                    (println n))
                   ((loop loop) (+ n -1)))
                  ((loop loop) (+ n -1))))
                (ifleq0
                 (+ ((isPrimeP isPrimeP) n) (* -1 1))
                 (ifleq0
                  (+ 1 (* -1 ((isPrimeP isPrimeP) n)))
                  ((lambda (x) ((loop loop) (+ n -1)))
                   (println n))
                  ((loop loop) (+ n -1)))
                 ((loop loop) (+ n -1))))))))
        (lambda (isPrimeP)
          (lambda (n) (((prime_loop prime_loop) n) (+ n -1))))))
     (lambda (prime_loop)
       (lambda (n)
         (lambda (divisor)
           (ifleq0
            (+ n (* -1 1))
            (ifleq0
             (+ 1 (* -1 n))
             1
             (ifleq0
              (+ divisor (* -1 1))
              (ifleq0
               (+ 1 (* -1 divisor))
               1
               (ifleq0
                (+
                 (((dividesP dividesP) divisor) n)
                 (* -1 1))
                (ifleq0
                 (+
                  1
                  (* -1 (((dividesP dividesP) divisor) n)))
                 0
                 (((prime_loop prime_loop) n)
                  (+ divisor -1)))
                (((prime_loop prime_loop) n)
                 (+ divisor -1))))
              (ifleq0
               (+ (((dividesP dividesP) divisor) n) (* -1 1))
               (ifleq0
                (+
                 1
                 (* -1 (((dividesP dividesP) divisor) n)))
                0
                (((prime_loop prime_loop) n) (+ divisor -1)))
               (((prime_loop prime_loop) n)
                (+ divisor -1)))))
            (ifleq0
             (+ divisor (* -1 1))
             (ifleq0
              (+ 1 (* -1 divisor))
              1
              (ifleq0
               (+ (((dividesP dividesP) divisor) n) (* -1 1))
               (ifleq0
                (+
                 1
                 (* -1 (((dividesP dividesP) divisor) n)))
                0
                (((prime_loop prime_loop) n) (+ divisor -1)))
               (((prime_loop prime_loop) n) (+ divisor -1))))
             (ifleq0
              (+ (((dividesP dividesP) divisor) n) (* -1 1))
              (ifleq0
               (+ 1 (* -1 (((dividesP dividesP) divisor) n)))
               0
               (((prime_loop prime_loop) n) (+ divisor -1)))
              (((prime_loop prime_loop) n)
               (+ divisor -1))))))))))
  (lambda (dividesP)
    (lambda (divisor)
      (lambda (n)
        ((lambda (loop) ((loop loop) 1))
         (lambda (loop)
           (lambda (m)
             (ifleq0
              (+ (* divisor m) (* -1 n))
              (ifleq0
               (+ n (* -1 (* divisor m)))
               1
               (ifleq0
                (+ (+ n (* -1 (* divisor m))) (* -1 1))
                0
                ((loop loop) (+ m 1))))
              (ifleq0
               (+ (+ n (* -1 (* divisor m))) (* -1 1))
               0
               ((loop loop) (+ m 1)))))))))))
