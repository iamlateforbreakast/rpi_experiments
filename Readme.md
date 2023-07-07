# A collection of experiments for the Raspberry Pi.

Create an SSH key for the Raspberry Pi.

`ssh-keygen -t rsa -b 4096 -C "name@email.com"`

Copy the content of ~/.ssh/id_rsa.pub to Github settings.

Test
`ssh -T git@github.com`

`git remote set-url origin git@github:iamlateforbreakast/rpi_experiments.git`

