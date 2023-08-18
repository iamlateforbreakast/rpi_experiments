# A collection of experiments for the Raspberry Pi.

## Setup access to githu from raspberry pi

Create an SSH key for the Raspberry Pi.

`ssh-keygen -t rsa -b 4096 -C "name@email.com"`

Copy the content of ~/.ssh/id_rsa.pub to Github settings.

Test
`ssh -T git@github.com`

`git remote set-url origin git@github.com:iamlateforbreakast/rpi_experiments.git`

`git config pull.rebase false`


