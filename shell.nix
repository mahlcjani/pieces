with import <nixpkgs> {};

mkShellNoCC {
    packages = [
        act
        git
        nodejs
        openssh
        vim
    ];
    shellHook = ''
        echo Updating packages...
        npm install
#        npx playwright install
#        npx playwright install-deps
    ''; 
}

