ltorg client
============

A command line client for updating leightonturner.org. Source code for the site
can be found at the companion repository [ltorg](https://github.com/leighton/ltorg).

Two programs:

1. `cpu-daemon`, a CPU daemon that broadcasts your CPU usage to the site.
2. `activity`, a script that updates the website with a user defined message for a
user defined period of time.


Usages: 

    ./bin/cpu-daemon

and

    ./bin/activity -t <timeout: 30s, 1m, 1h, etc> -m "<message>"

It's that simple.



